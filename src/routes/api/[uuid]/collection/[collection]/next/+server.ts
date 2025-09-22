import { existsSync, writeFileSync } from 'fs'
import { API_KEY, USED_KEYS_FN } from '$env/static/private'
import { sendMessage, checkConnection, getCollectionKey, keyById } from '$lib/server'
import { chatPost } from '$lib/server/vk'

const backupDir = USED_KEYS_FN.substring(0, USED_KEYS_FN.lastIndexOf('/'))

export const GET = async ({ params, url, locals }) => {
    const { uuid, collection } = params
    if(uuid !== API_KEY) return new Response('Not allowed', {status: 401})
    const { searchParams } = url
    const admin = searchParams.get('admin') === 'true'
    const { usedKeys } = locals

    const client = await checkConnection()
    const listKey = getCollectionKey(collection)
    const _id = await client.rPopLPush(listKey, listKey)
    if(!_id) throw 'id is undefined'
    const arr = await client.lRange(listKey, 0, 10000)
    usedKeys[collection] = arr
    if(existsSync(backupDir)) writeFileSync(USED_KEYS_FN, JSON.stringify(usedKeys))
    const id = +_id
    const key = await keyById(id)
    const all = await client.hGetAll(key)
    const { link, message, tags, author } = all
    if(!(typeof link === 'string' && typeof message === 'string' || typeof author === 'string' && typeof message === 'string')) throw `bad record ${id}`

    const props = { link, message, tags, id, collection, author }

    if(collection === 'vk') {
        const { message, link } = props
        await chatPost(message, link)
    }
    else await sendMessage(props, admin)
    return new Response()
}
