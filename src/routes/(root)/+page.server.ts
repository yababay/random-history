import YDB from 'ydb-sdk'
import { dev } from '$app/environment'
import { publishRecord, saveRecord } from '$lib/server'

export const actions = {
    
    default: async ({ request, locals }) => {

        const data = await request.formData()
        const { driver } = locals

        const id = await driver.tableClient.withSession(async (session: YDB.TableSession) => {
            return await saveRecord(session, data)
        })
        
        if(dev) console.log(`record with id ${id} is created`)
        return { id }
    },

    publish: async ({ request, locals }) => {

        const data = await request.formData()
        const { driver } = locals

        const id = await driver.tableClient.withSession(async (session: YDB.TableSession) => {
            return await publishRecord(session, data)
        })
        return { id }
    }
}
