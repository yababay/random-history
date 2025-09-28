import YDB from 'ydb-sdk'
import type { RandomHistoryRecord } from '$lib'
import { dev } from '$app/environment';
import { sendMessage } from '../telegram';
import { postMessageToChat } from '../vk';

const { Column, TableDescription, Types, Ydb } = YDB

export class VKontakte extends TableDescription {
  constructor() {
    super();
    this.columns.push(new Column('id', Types.INT32))
    this.columns.push(new Column('ts', Types.DATETIME))
    this.withPrimaryKey('id')
  }
} 

export const nextIdFromCollection = async (session: YDB.TableSession, collection: string = 'vkontakte') => {

    const vk = collection === 'vk'
    const query = vk 
    ?
    `select id from vkontakte order by ts limit 1`
    :
    `select id from messages where collection = '${collection}' order by ts limit 1`

    const result = await session.executeQuery(query)
    const id = intFromResultSets(result)
    await session.executeQuery(`update ${vk ? 'vkontakte' : 'messages'} set ts = ${getYDBTimestamp()} where id = ${id}`)
    return id
}

const COLUMNS = [ 'id', 'collection', 'message', 'link', 'author', 'tags', 'ts' ]

export class RandomHistory extends TableDescription {
    constructor() {
      super();
      for(const col of COLUMNS){
        switch(col) {
          case 'id':
            this.columns.push(new Column(col, Types.INT32))
            continue
          case 'collection':
          case 'message':
                this.columns.push(new Column(col, Types.UTF8))
            continue
          case 'ts':
            this.columns.push(new Column(col, Types.DATETIME))
            continue
          default:
            this.columns.push(new Column(col, Types.optional(Types.UTF8)))
         }
      }
      this.withPrimaryKey('id')
    }
}

export const publishRecord = async (session: YDB.TableSession, data: FormData) => {

        const coll = data.get('collection')?.toString().trim()
        const vk = data.get('vk')?.toString().trim()
        const collection = vk || coll
        const admin = data.get('admin')?.toString().trim()

        if(typeof collection !== 'string') throw 'no collection'

        const id = await nextIdFromCollection(session, collection)
        const record = await getRecordOrCollection(session, id)
        if(Array.isArray(record)) throw 'no arrays here'

        if(collection === 'vk') {
            const { link, message } = record
            if(!(link && message)) {
                console.log('no link')
                return
            }
            await postMessageToChat(message, link)
        }
        else await sendMessage(record, !!admin)
        
        if(dev) console.log(`message with id=${id} of collection ${collection} is published`)
        return id
}

export const saveRecord = async (session: YDB.TableSession, data: FormData) => {
  let id: string | number | undefined = data.get('id')?.toString()
  const collection = data.get('collection')?.toString()
  const message = data.get('message')?.toString().trim()
  const link = data.get('link')?.toString().trim()
  const author = data.get('author')?.toString().trim()
  const _tags = data.get('tags')?.toString().trim()
  const vk = !!data.get('vk')
  id = id ? +id : (await getMaxId(session)) + 1
  if(!(message && collection && !isNaN(id))) throw 'bad id or message or collection'
  const columns = ['id', 'message', 'collection']
  
  const distill = (s: string) => s.replaceAll("'", '`')
  
  const values: string[] = [id + '', `'${distill(message)}'`, `'${collection}'`]

  if(_tags) {
    let tags = _tags.split(' ').map((tag: string) => tag.trim()).filter((tag: string) => !!tag)
    if(tags.length){
      columns.push('tags')
      values.push(`'${tags.map((tag: string) => `#${tag}`).join(' ')}'`)
      await session.executeQuery(`upsert into tags (tag) values ${tags.map(t => `('${t}')`).join(', ')}`)
    }
  }
  if(link) {
    columns.push('link')
    values.push(`'${link}'`)
  }
  else if(author) {
    columns.push('author')
    values.push(`'${distill(author)}'`)
  }
  await session.executeQuery(`upsert into messages (${columns.join(', ')}) values (${values.join(', ')})`)
  if(vk) await session.executeQuery(`upsert into vkontakte (id, ts) values (${id}, ${getYDBTimestamp()})`)
  return +id
}

const collections = new Map<string, RandomHistoryRecord[]>()

export const getRecordOrCollection = async(session: YDB.TableSession, where: string | number = 'quotations', force = false): Promise<RandomHistoryRecord | RandomHistoryRecord[]> => {
    if(!force && typeof where === 'string' && collections.has(where)){
      return collections.get(where) || []
    }
    where = typeof where === 'string' ? `collection = '${where}'` : `id = ${where}`
    const query = `select ${COLUMNS.join(', ')} from messages where ${where} order by ts`
    const { resultSets } = await session.executeQuery(query);
    const [ resultSet ]  = resultSets
    const { rows } = resultSet
    if(!(rows && rows.length)) throw 'no rows'

    const recordFromItems = (row: YDB.Ydb.IValue): RandomHistoryRecord => {
      const { items } = row
      if(!(items && items.length)) throw 'no items'
      
      const record = new Map<string, string | number | null>(COLUMNS.map((column, i) => {
        const item = items[i]
        const { int32Value, textValue, uint32Value, nullFlagValue } = item
        const value =  int32Value || textValue || uint32Value || nullFlagValue 
        return [ column, value || null]
      }))
  
      const id = record.get('id')
      const message = record.get('message')
      const collection = record.get('collection')
      const author = record.get('author')
      const link = record.get('link')
      const tags = record.get('tags')
      if(typeof id !== 'number') throw 'bad id'
      if(typeof message !== 'string') throw 'bad message'
      if(typeof collection !== 'string') throw 'bad collection'
      if(!(link || author)) throw 'presense of link or author is obligate'
      const props: RandomHistoryRecord = { id, message, collection }
      if(typeof link === 'string') props['link'] = link
      if(typeof author === 'string')  props['author'] = author
      if(typeof tags === 'string')  props['tags'] = tags.split(' ').map(t => t.replace('#', ''))
  
      return props
    }

    const records = rows.map(recordFromItems)
    if(records.length > 1){ 
      const [ record ] = records
      const { collection } = record
      collections.set(collection, records)
      return records
    }
    const [ record ] = records
    return record
}

export const setLatest = async (session: YDB.TableSession, id: number) => {
  const query = `update messages set ts = ${getYDBTimestamp()} where id = ${id}`
  await session.executeQuery(query)
}

export const getYDBTimestamp = (date: Date = new Date()) => `Datetime("${date.toISOString().slice(0, -5)}Z")`

export const getMessagesCount = async (session: YDB.TableSession) => {
  return await getRecordCount(session, 'messages')
}

const getRecordCount = async (session: YDB.TableSession, table: string) => {
  const query = `select count(*) from ${table}`
  const result = await session.executeQuery(query)
  return intFromResultSets(result)
}

export const getMaxId = async (session: YDB.TableSession, table = 'messages') => {
  const query = `select max(id) from ${table}`
  const result = await session.executeQuery(query)
  return intFromResultSets(result)
}

export const getTags = async (session: YDB.TableSession) => {
  const query = `select tag from tags`
  const result = await session.executeQuery(query)
  return textFromResultSets(result)
}

const textFromResultSets = (result: YDB.Ydb.Table.ExecuteQueryResult): string | string[] => {
  const { resultSets } = result
  const [ resultSet ]  = resultSets
  const { rows } = resultSet
  if(!Array.isArray(rows)) throw 'bad rows'
  if(rows.length === 1) {
    const [ row ] = rows
    const { items } = row
    if(!Array.isArray(items)) throw 'bad items'
    const [ item ] = items
    const { textValue } = item
    if(typeof textValue !== 'string') throw 'bad string'
    return textValue
  }
  return rows.map(({items}) => (items && items[0] || { textValue: 'hz' }).textValue) as string[]
}

const intFromResultSets = (result: YDB.Ydb.Table.ExecuteQueryResult) => {
  const { resultSets } = result
  const [ resultSet ]  = resultSets
  const { rows } = resultSet
  if(!Array.isArray(rows)) throw 'bad rows'
  const [ row ] = rows
  const { items } = row
  if(!Array.isArray(items)) throw 'bad items'
  const [ item ] = items
  const { int32Value } = item
  if(typeof int32Value !== 'number') throw 'bad int'
  return int32Value
}
