import { dev } from '$app/environment'
import { REDIS_PREFIX } from '$env/static/private'
import { checkConnection, saveRecord } from '$lib/server.prev'
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
        const id = await saveRecord(data)
        if(dev) console.log(`record with id ${id} is saved`)
        const lastSlash = pathname.indexOf('/edit')
        throw redirect(302, pathname.slice(0, lastSlash))
    }
}