import { getTags } from "$lib/server"
import { json } from "@sveltejs/kit"

export const GET = async () => {
    return json(await getTags())
}