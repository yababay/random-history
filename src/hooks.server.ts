import { readFileSync, existsSync } from 'fs'
import { building } from '$app/environment'
import { API_KEY, YANDEX_APPLICATION_SECRET, YANDEX_CLIENT_ID, YANDEX_TRUSTED_USER, USED_KEYS_FN } from '$env/static/private'
import { tgDebug, distillCollection } from '$lib/server.prev'
import { redirect } from '@sveltejs/kit'
import axios from 'axios'
import type { UsedKeys, Collection } from '$lib/types.prev'

const loginUrl = `https://login.yandex.ru/info?format=json&jwt_secret=${YANDEX_APPLICATION_SECRET}`
let usedKeys: UsedKeys = {}

if(!building){
    if(existsSync(USED_KEYS_FN)) {
        const json = readFileSync(USED_KEYS_FN, 'utf8')
        usedKeys = JSON.parse(json)
        for(const key of Reflect.ownKeys(usedKeys)){
            if(typeof key !== 'string') continue
            const arr = Reflect.get(usedKeys, key)
            if(!Array.isArray(arr)) continue
            const coll = key as Collection
            await distillCollection(coll, arr)
        }
    }
}

export async function handle({ event, resolve }) {
    const { url, cookies, locals } = event
    const { pathname, hostname } = url
    locals.usedKeys = usedKeys
    if(hostname === 'localhost') return await resolve(event)
    if(pathname.startsWith(`/api/${API_KEY}`)) return await resolve(event)
    if(['/login', '/auth', '/api/login'].includes(pathname)) return await resolve(event)
    const token = cookies.get('access_token')
    const headers = { 'Authorization': `Oauth ${token}` }
    const { data } = await axios.get(loginUrl, { headers })
    const { client_id, id } = data
    if(!(client_id === YANDEX_CLIENT_ID && +id === +YANDEX_TRUSTED_USER)){ 
        await tgDebug(`Bad authorization:\n\n${token}\n\n${JSON.stringify(data)}`)
        throw redirect(302, '/login') 
    }
    return await resolve(event)
}
