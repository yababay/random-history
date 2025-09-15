import { createClient, type RedisClientType } from 'redis'
import { REDIS_PORT, REDIS_PREFIX, RECORDS_PER_PAGE } from '$env/static/private'
import type { RandomHistory } from '$lib/types'

const rpp = +RECORDS_PER_PAGE

let client: RedisClientType

const url = `redis://localhost:${REDIS_PORT}`

export const checkConnection = async (): Promise<RedisClientType> => {
    if(!client) client = createClient({url})
    if(!client.isOpen) await client.connect()
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

export const getItems = async (collection: string, page: number = 1) => {
    const client = await checkConnection()
    const pattern = getItemsKey(collection)
    const keys = await client.keys(pattern)
    const tss = (await Promise.all(keys.map(key => client.hGet(key, 'ts')))).filter(ts => !!ts)
    const byTs = new Map<string, string>(tss.map((ts, i) => [ts || '', keys[i] || '']))
    const maxPage = Math.ceil(tss.length / rpp)
    if(page > maxPage) page = maxPage
    let from = page - 1
    if(from < 0) from = 0
    tss.sort()
    const arr = tss.slice(from * rpp, page * rpp)
    return await Promise.all(arr.map(ts => byTs.get(ts || '') || '').map(key => client.hGetAll(key)))
}