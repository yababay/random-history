import { backup, checkConnection } from '$lib/server'

export const GET = async () => {
    const client = await checkConnection()
    await client.bgSave()
    await backup()
    return new Response()
}
