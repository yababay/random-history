import { API_KEY, YANDEX_APPLICATION_SECRET, YANDEX_CLIENT_ID, YANDEX_TRUSTED_USER } from '$env/static/private'
import { tgDebug } from '$lib/server'
import { redirect } from '@sveltejs/kit'
import axios from 'axios'

const loginUrl = `https://login.yandex.ru/info?format=json&jwt_secret=${YANDEX_APPLICATION_SECRET}`

export async function handle({ event, resolve }) {
    const { url, cookies } = event
    const { pathname, hostname } = url
    if(hostname === 'localhost') return await resolve(event)
    if(pathname.startsWith(`/api/${API_KEY}`)) return await resolve(event)
    if(['/login', '/auth'].includes(pathname)) return await resolve(event)
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
