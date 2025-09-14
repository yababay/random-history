import { createClient, type RedisClientType } from 'redis'
import { REDIS_PORT } from '$env/static/private'

let client: RedisClientType

const prepareUrl = (port: number | string) => `redis://localhost:${port}`

export const checkConnection = async (port: number | string = REDIS_PORT): Promise<RedisClientType> => {
    if(!client) {
	const url = prepareUrl(port)
        client = createClient({url})
    }
    if(!client.isOpen) await client.connect()
    return client
}
