import { Column, TableDescription, TableSession, Types, Ydb } from 'ydb-sdk'
import type { RandomHistoryRecord } from '$lib';

export class VKontakte extends TableDescription {
  constructor() {
    super();
    this.columns.push(new Column('id', Types.INT32))
    this.columns.push(new Column('ts', Types.DATETIME))
    this.withPrimaryKey('id')
  }
} 

export const nextIdFromCollection = async (session: TableSession, collection: string = 'vkontakte') => {
    const result = await session.executeQuery(`select id from ${collection} order by ts limit 1`)
    const id = intFromResultSets(result)
    await session.executeQuery(`update ${collection} set ts = ${getYDBTimestamp()} where id = ${id}`)
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

export const getNextRecord = async(session: TableSession, where: string | number = 'quotations'): Promise<RandomHistoryRecord> => {
    where = typeof where === 'string' ? `collection = '${where}'` : `id = ${where}`
    const query = `select ${COLUMNS.join(', ')} from messages where ${where} order by ts limit 1`
    const { resultSets } = await session.executeQuery(query);
    const [ resultSet ]  = resultSets
    const { rows } = resultSet
    if(!(rows && rows.length)) throw 'no rows'
    const [ row ] = rows
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
    const props: RandomHistoryRecord = { id, message, collection }
    if(typeof link === 'string') props['link'] = link
    if(typeof author === 'string')  props['author'] = author
    if(typeof tags === 'string')  props['tags'] = tags

    return props
}

export const setLatest = async (session: TableSession, id: number) => {
  const query = `update messages set ts = ${getYDBTimestamp()} where id = ${id}`
  await session.executeQuery(query)
}

export const getYDBTimestamp = (date: Date = new Date()) => `Datetime("${date.toISOString().slice(0, -5)}Z")`

export const getMaxId = async (table: string, session: TableSession) => {
  const query = `select id from ${table} order by ts desc limit 1`
  const result = await session.executeQuery(query)
  return intFromResultSets(result)
}

const intFromResultSets = (result: Ydb.Table.ExecuteQueryResult) => {
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
