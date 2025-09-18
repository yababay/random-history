import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const { REDIS_PORT, REDIS_PREFIX } = process.env

if(!(REDIS_PORT && REDIS_PREFIX)) throw 'bad config'

const url = `redis://localhost:${REDIS_PORT}`
const client = createClient({url})

await client.connect()

console.log('is connected')

let maxPicture = 0
let maxPost = 0

const keys = await client.keys(`${REDIS_PREFIX}:record:*`)
const date = new Date()

for(const key of keys) {
    const link = await client.hGet(key, 'link')
    if(!link) continue
    let arr = /.*\/(\d+).(jpg|jpeg|png|JPG|JPEG|PNG)+$/.exec(link) || []
    const [ _, _id ] = arr
    let id = +_id
    if(isNaN(id)) continue
    maxPicture = Math.max(maxPicture, id)
    arr = /.*\:(\d+)$/.exec(key) || []
    const [ __, __id ] = arr
    id = +__id
    if(isNaN(id)) continue
    maxPost = Math.max(maxPost, id)
}

console.log('max picture', maxPicture)
console.log('max post', maxPost)

await client.set('random-history:sequence:picture', maxPicture + '')
await client.set('random-history:sequence:post', maxPost + '')

await client.bgSave()
await client.quit()

console.log('is disconnected')
