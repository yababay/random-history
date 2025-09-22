import { backup, checkConnection } from '$lib/server'

export const GET = async () => {
    const client = await checkConnection()
    await backup()
    return new Response()
}
