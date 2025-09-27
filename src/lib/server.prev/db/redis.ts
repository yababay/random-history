import { createClient, type RedisClientType } from 'redis'
import { REDIS_PORT, REDIS_PREFIX } from '$env/static/private'
import type { Collection } from '$lib/types.prev'

let client: RedisClientType

const url = `redis://localhost:${REDIS_PORT}`

export const distillCollection = async (coll: Collection, arr: string[] = []) => {
    const used = new Set<string>()
    const pure = new Array<string>()
    const client = await checkConnection()
    const key = getCollectionKey(coll)
    if(!arr.length) arr = await client.lRange(key, 0, 10000) 
    for(const id of arr) {
        if(!id || used.has(id)) continue
        used.add(id)
        pure.push(id)
    } 
    const tmp = key + ':tmp'
    await client.lPush(tmp, pure)
    await client.rename(tmp, key)
    return pure
}

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
    await client.connect()
    return client
}

const getKey = (postfix: string) => `${REDIS_PREFIX}:${postfix}`
const getTagsKey = () => getKey('tags')

export const getCollectionKey = (collection: string): string => getKey(`collection:${collection}`)
export const getUpdateKey = (suffix = 'latest') => getKey('update:' + suffix)

export const setLatestUpdate = async () => {
    const client = await checkConnection()
    const [ key, value ] = [getUpdateKey(), new Date().toISOString()]
    await client.set(key, value)
    await client.expire(key, 60)
}

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
    await client.lPush(getCollectionKey(collection), id + '')
    await client.bgSave()
    return id
}
