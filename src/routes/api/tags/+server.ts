import { getTags } from "$lib/server"
import { json } from "@sveltejs/kit"
import type { TableSession } from "ydb-sdk"

export const GET = async ({ locals }) => {
    const { driver } = locals
    const tags = await driver.tableClient.withSession(async (session: TableSession) => {
        return await getTags(session)
    })
    return json(tags)
}