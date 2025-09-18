import { dev } from '$app/environment'
import { REDIS_PREFIX } from '$env/static/private'
import { checkConnection, keyById, keyWithDate } from '$lib/server'
import { redirect } from '@sveltejs/kit'

export const load = async ({ params }) => {
    const { id } = params
    const client = await checkConnection()
    const keys = await client.keys(`${REDIS_PREFIX}:record:*:${id}`)
    if(keys.length !== 1) throw `bad keys for id ${id}`
    const [ key ] = keys
    const record = await client.hGetAll(key)
    return { record }
}

export const actions = {
    default: async ({ request, url }) => {
        const { pathname } = url
        const data = await request.formData()
        const message = data.get('message')?.toString().trim()
        const author = data.get('author')?.toString().trim()
        const _tags = data.get('tags')?.toString()
        const id = data.get('id')?.toString()
        const vk = data.get('vk')?.toString()
        const collection = data.get('collection')?.toString()
        if(!( id && message && collection)) throw 'no id or message or collection'
        let tags = new Array<string>()
        if(_tags) tags = _tags.split(' ')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => !!tag)
            .map((tag: string) => `#${tag}`)
        const from = await keyById(id)
        const to = keyWithDate(collection, id)
        const client = await checkConnection()
        await client.hSet(from, 'message', message)
        if(author) await client.hSet(from, 'author', author)
        if(tags.length) {
            await client.hSet(from, 'tags', tags.join(' '))
            await client.sAdd(`${REDIS_PREFIX}:tags`, tags)
        }
        await client.rename(from, to)
        if(vk) await client.lPush(`${REDIS_PREFIX}:collection:vk`, id)
        const lastSlash = pathname.indexOf('/edit')
        if(dev) console.log(`record with id ${id} is saved`)
        throw redirect(302, pathname.slice(0, lastSlash))
    }
}