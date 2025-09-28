import YDB from 'ydb-sdk'
import { dev } from '$app/environment'
import { getRecordOrCollection, saveRecord, setLatest } from '$lib/server'
import { redirect } from '@sveltejs/kit'

export const load = async ({ params, locals }) => {

    const { id } = params
    const _id = +id
    if(isNaN(_id)) throw 'bad id'

    const { driver } = locals

    const record = await driver.tableClient.withSession(async (session: YDB.TableSession) => {
        return await getRecordOrCollection(session, _id)
    })

    return { record }
}

export const actions = {
    default: async ({ request, url, locals }) => {
        
        const { pathname } = url
        const data = await request.formData()
        const { driver } = locals

        const id = await driver.tableClient.withSession(async (session: YDB.TableSession) => {
            const id = await saveRecord(session, data)
            await setLatest(session, id)
            return id
        })
    
        if(dev) console.log(`record with id ${id} is saved`)

        const lastSlash = pathname.indexOf('/edit')
        throw redirect(302, pathname.slice(0, lastSlash))
    }
}
