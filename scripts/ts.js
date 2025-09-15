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
const date = new Date()

for(const key of keys) {
    let seconds = date.getSeconds()
    seconds -= count
    const ts = new Date(date)
    ts.setSeconds(seconds)
    await client.hSet(key, 'ts', ts.toISOString())
   count++
}

console.log(keys.length, 'records are pumped')

await client.bgSave()
await client.quit()

console.log('is disconnected')
