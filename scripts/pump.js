import { Client } from 'pg'
import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const { POSTGRES_CONNECTION_STRING, REDIS_PORT, REDIS_PREFIX } = process.env

if(!(POSTGRES_CONNECTION_STRING && REDIS_PORT && REDIS_PREFIX)) throw 'bad config'

const pgClient = new Client({
    connectionString: POSTGRES_CONNECTION_STRING
})

const url = `redis://localhost:${REDIS_PORT}`
const redisClient = createClient({url})

await redisClient.connect()
await pgClient.connect()

console.log('both are connected')
let query = 'select * from ready_for_publications'
const result = await pgClient.query(query)
const { rows } = result

let count = 0

for(const row of rows) {
    //if(count >= 5) break
    let { id, link, message, tags, collection } = row
    if(!(id && link && message && collection)) throw 'bad props'
    const key = `${REDIS_PREFIX}:record:${collection}:${id}`
    await redisClient.hSet(key, 'link', link)
    await redisClient.hSet(key, 'message', message)
    tags = (Array.isArray(tags) && tags || []).filter(el => el && el.trim())
    //console.log(key, tags)
    if(tags.length){ 
        await redisClient.hSet(key, 'tags', tags.map(el => `#${el}`).join(' '))
        await redisClient.sAdd(`${REDIS_PREFIX}:tags`, tags)
    }
    await redisClient.lPush(`${REDIS_PREFIX}:collection:${collection}`, `${id}`)
    count++
}

console.log(count, 'records are pumped')

await redisClient.bgSave()
await redisClient.quit()
await pgClient.end()

console.log('both are disconnected')
