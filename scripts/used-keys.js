import { readFileSync, writeFileSync } from 'fs'
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
let queryPrefix = 'select * from ready_for_publications_ts'
const keys = await redisClient.keys(`${REDIS_PREFIX}:collection:*`)
const jfn = '.data/used-keys.json'
const used = JSON.parse(readFileSync(jfn, 'utf8'))

for(const key of keys) {
    if(key.endsWith(':vk')) continue
    const coll = /.*\:([^\:]+)$/.exec(key)[1]
    //if(coll === 'current') coll = 'cognitive'
    let arr = used[coll] || []

    const save = async () => {
        const tmp = `${key}:used`
        await redisClient.lPush(tmp, arr)
        await redisClient.rename(tmp, key)
    }

    if(arr.length) {
        await save()
        continue
    }

    const query = `${queryPrefix} where collection = '${coll === "cognitive" ? "current" : coll}'`
    const result = await pgClient.query(query)
    const { rows } = result
    arr = rows.map(({id}) => id + '')
    if(!arr.length) continue
    const [ row ] = arr
    console.log(coll, row, arr.length)
    used[coll] = arr
    await save()
}

writeFileSync(jfn.replace('/', '/_'), JSON.stringify(used, {space: 4}))

await redisClient.bgSave()
await redisClient.quit()
await pgClient.end()

console.log('both are disconnected')
