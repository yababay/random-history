import { existsSync } from 'fs'
import { backup } from '../backup'
import { checkConnection, getUpdateKey } from './redis'

export const setupSubscription = async () => {
    const client = await checkConnection()
    const pubsub = client.duplicate()
    if(!pubsub.isOpen) await pubsub.connect()
    await pubsub.configSet('notify-keyspace-events', 'EKnx')
    const key = getUpdateKey()
    await pubsub.pSubscribe(`__keyspace@0__:${key}`, async (channel: string, msg: string) => {
        const ts = await client.get(key)
        if(!(ts && existsSync('/mnt/backup'))) return
        await backup(new Date(ts), true)
    })
}
