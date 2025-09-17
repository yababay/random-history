import { checkConnection } from '$lib/server'
import { REDIS_PREFIX } from '$env/static/private'
import { PUBLIC_ROWS_PER_PAGE } from '$env/static/public'

const rpp = +PUBLIC_ROWS_PER_PAGE

export const load = async ({ params }) => {
    const { collection, page } = params
    const pn = +page
    if(isNaN(pn)) throw 'bad page number'
    const from = (pn - 1) * rpp
    const to = pn * rpp
    const client = await checkConnection()
    const pattern = `${REDIS_PREFIX}:record:*:${collection}:*`
    const keys = await client.keys(pattern)
    const records = await Promise.all(keys.sort().slice(from, to).map(key => client.hGetAll(key)))
    records.forEach((rec, i) => {
        if(!rec) return
        const [ _, id ] = /.*\:(\d+)$/.exec(keys[i]) || ''
        if(!id) return
        rec.id = id
    })
    return { records }
}

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData()
        const id = data.get('id')?.toString() 
        if(!id || isNaN(+id)) throw `bad id ${id}`
        const client = await checkConnection()
        const keys = await client.keys(`${REDIS_PREFIX}:*:${id}`)
        if(keys.length !== 1) throw `bad key for ${id} (${keys})`
        const [ key ] = keys
        const target = key.replace(':record:', ':removed:')
        await client.rename(key, target)
        return { ok: true }
    }
}
