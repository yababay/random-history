import { createClient, type RedisClientType } from 'redis'
import { REDIS_PORT, REDIS_PREFIX } from '$env/static/private'
import type { RandomHistory } from '$lib/types'
import { restoreFromBucket } from '../s3'

let client: RedisClientType

const url = `redis://localhost:${REDIS_PORT}`

export const getISODate = (date = new Date) => date.toISOString().slice(0, -5)

export const getNextRecordId = async () => {
    const client = await checkConnection()
    return await client.incr('random-history:sequence:record')
}

export const getNextPictureId = async () => {
    const client = await checkConnection()
    return await client.incr('random-history:sequence:picture')
}

export const checkConnection = async (): Promise<RedisClientType> => {
    if(!client) client = createClient({url})
    if(client.isOpen) return client
    //await restoreFromBucket()
    await client.connect()
    return client
}

const getKey = (postfix: string) => `${REDIS_PREFIX}:${postfix}`
const getCollectionKey = (collection: string) => getKey(`collection:${collection}`)
const getTagsKey = () => getKey('tags')
const getItemKey  = (collection: string, id: number | string) => getKey(`record:${collection}:${id}`)
const getItemsKey = (collection: string) => getItemKey(collection, '*')

export const saveTags = async (key: string, tags: string[]) => {
    tags = tags.filter(el => el && el.trim())
    const client = await checkConnection()
    if(tags.length){ 
        await client.hSet(key, 'tags', tags.map(el => `#${el}`).join(' '))
        await client.sAdd(getTagsKey(), tags)
    }
}

export const getTags = async () => {
    const client = await checkConnection()
    return (await client.sMembers(getTagsKey())).sort()
}

export const getNextRecord = async (collection: string): Promise<RandomHistory> => {
    const listKey = getCollectionKey(collection)
    const client = await checkConnection()
    const _id = await client.rPopLPush(listKey, listKey)
    if(!_id) throw `no id in ${collection}`
    const id = +_id
    const keys = await client.keys(`${REDIS_PREFIX}:*:${id}`)
    if(keys.length !== 1) throw `no keys for id ${id} in ${collection}`
    const [ key ] = keys
    const props = await client.hGetAll(key)
    const { link, message, tags, author } = props
    if(!(typeof link === 'string' && typeof message === 'string' || typeof author === 'string' && typeof message === 'string')) throw `bad record ${id}`
    return { link, message, tags, id, collection, author }
}

export const keyWithDate = (collection: string, id: number | string) => {
    return `${REDIS_PREFIX}:record:${getISODate()}:${collection}:${id}`
}

export const keyById = async (id: number | string) => {
    const client = await checkConnection()
    const keys = await client.keys(`${REDIS_PREFIX}:record:*:${id}`)
    if(keys.length !== 1) throw `bad keys for id ${id}`
    const [ key ] = keys
    return key
}

export const saveRecord = async (data: FormData) => {
    const message = data.get('message')?.toString().trim()
    const author = data.get('author')?.toString().trim()
    const _tags = data.get('tags')?.toString()
    let id = data.get('id')?.toString()
    const link = data.get('link')?.toString()
    const vk = !!data.get('vk')?.toString()
    const collection = data.get('collection')?.toString()
    if(!(message && collection)) throw 'no id or message or collection'
    let tags = new Array<string>()
    if(_tags) tags = _tags.split(' ')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => !!tag)
        .map((tag: string) => `#${tag}`)
    const from = id ? (await keyById(id)) : `${REDIS_PREFIX}:record:new`
    if(!id) id = await getNextRecordId() + ''
    const to = keyWithDate(collection, id)
    const client = await checkConnection()
    await client.hSet(from, 'message', message)
    if(link) await client.hSet(from, 'link', link)
    if(author) await client.hSet(from, 'author', author)
    if(tags.length) {
        await client.hSet(from, 'tags', tags.join(' '))
        await client.sAdd(`${REDIS_PREFIX}:tags`, tags)
    }
    await client.rename(from, to)
    if(vk) await client.lPush(`${REDIS_PREFIX}:collection:vk`, id)
    await client.bgSave()
    return id
}
