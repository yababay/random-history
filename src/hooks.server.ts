import YDB from 'ydb-sdk'
import axios from 'axios'
import { redirect } from '@sveltejs/kit'
import { building } from '$app/environment'
import { getDriver } from '$lib/server'
import { YANDEX_APPLICATION_SECRET, YANDEX_CLIENT_ID, YANDEX_TRUSTED_USER } from '$env/static/private'

let driver: YDB.Driver

const loginUrl = `https://login.yandex.ru/info?format=json&jwt_secret=${YANDEX_APPLICATION_SECRET}`

if(!building) {
    driver = await getDriver()
}

export async function handle({ event, resolve }) {
    const { url, cookies, locals } = event
    const { pathname, hostname } = url
    locals.driver = driver
    if(hostname === 'localhost' || ['/login', '/auth', '/api/login'].includes(pathname)) return await resolve(event)
    const token = cookies.get('access_token')
    const headers = { 'Authorization': `Oauth ${token}` }
    const { data } = await axios.get(loginUrl, { headers })
    const { client_id, id } = data
    if(!(client_id === YANDEX_CLIENT_ID && +id === +YANDEX_TRUSTED_USER)){ 
        console.log(`Bad authorization:\n\n${token}\n\n${JSON.stringify(data)}`)
        throw redirect(302, '/login') 
    }
    return await resolve(event)
}
