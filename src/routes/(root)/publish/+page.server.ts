import YDB from 'ydb-sdk'
import { publishRecord } from '$lib/server'

export const actions = {
    publish: async ({ request, locals }) => {

        const data = await request.formData()
        const { driver } = locals

        const id = await driver.tableClient.withSession(async (session: YDB.TableSession) => {
            return await publishRecord(session, data)
        })
        return { id }
    }
}
