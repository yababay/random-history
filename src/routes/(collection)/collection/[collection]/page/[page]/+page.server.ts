import YDB from 'ydb-sdk'
import { getRecordOrCollection } from '$lib/server'
import { PUBLIC_ROWS_PER_PAGE } from '$env/static/public'
import type { RouteParams } from './$types.js'

const rpp = +PUBLIC_ROWS_PER_PAGE

const getRecords = async (session: YDB.TableSession, params: RouteParams, force = false) => {

    const { collection, page } = params

    const pn = +page
    if(isNaN(pn)) throw 'bad page number'
    const from = (pn - 1) * rpp
    const to = pn * rpp

    const arr = await getRecordOrCollection(session, collection, force)
    if(!Array.isArray(arr)) throw 'no arr'
    const records = arr.slice(from, to)

    return { records, count: records.length }
}

export const load = async ({ params, locals }) => {

    const  { driver } = locals

    return await driver.tableClient.withSession(async (session: YDB.TableSession) => {
        return await getRecords(session, params)
    })
}

export const actions = {
    default: async ({ request, locals, params }) => {

        const data = await request.formData()
        const id = data.get('id')?.toString() 
        if(!id || isNaN(+id)) throw `bad id ${id}`

        const { driver } = locals
            
        return await driver.tableClient.withSession(async (session: YDB.TableSession) => {
            await session.executeQuery(`update messages set collection = 'drafts' where id = ${id}`)
            return await getRecords(session, params, true)
        })
    }
}
