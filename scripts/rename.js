import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const { REDIS_PORT, REDIS_PREFIX } = process.env

if(!(REDIS_PORT && REDIS_PREFIX)) throw 'bad config'

const url = `redis://localhost:${REDIS_PORT}`
const client = createClient({url})

await client.connect()

console.log('is connected')

let count = 0

const keys = await client.keys(`${REDIS_PREFIX}:record:*`)
const date = new Date().toISOString().slice(0, -5)

for(const key of keys) {
    let update = key.replace(':record:', `:record:${date}:`)
    if(update.includes(':current:')) update = update.replace(':current:', ':cognitive:')
    await client.rename(key, update)
   count++
}

await client.rename(`${REDIS_PREFIX}:collection:current`, `${REDIS_PREFIX}:collection:cognitive`)

console.log(keys.length, 'records are renamed')

await client.bgSave()
await client.quit()

console.log('is disconnected')
