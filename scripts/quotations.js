import { readFileSync, existsSync } from 'fs'
import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const { REDIS_PORT, REDIS_PREFIX } = process.env

if(!(REDIS_PORT && REDIS_PREFIX)) throw 'bad config'

const url = `redis://localhost:${REDIS_PORT}`
const client = createClient({url})

await client.connect()

console.log('is connected')

let fnCount = 1
let recCount = 1
const max = 48575
const QUOTATIONS_WORD = 'quotations'
const collKey = `${REDIS_PREFIX}:collection:${QUOTATIONS_WORD}`

await client.del(collKey)

const getFileName = () => {
    let suffix = `${fnCount}`
    if(fnCount < 100 && fnCount > 9) suffix = `0${fnCount}`
    else if (fnCount < 10) suffix = `00${fnCount}`
    return `../eloquence/static/${QUOTATIONS_WORD}-${suffix}.json`
}

while(fnCount <= 22) {
    const fn = getFileName()
    console.log(fn)
    if(!existsSync(fn)) throw `no such file: ${fn}`
    const json = readFileSync(fn, 'utf8')
    const obj = JSON.parse(json)
    if(!Array.isArray(obj)) throw `bad array ${typeof obj}`
    for(const quot of obj) {
        const { russian } = quot
        const { author, caption } = russian
        if(!(typeof author === 'string' && typeof caption === 'string')) throw `bad author or caption`
        const id = max - recCount
        const recKey = `${REDIS_PREFIX}:record:${QUOTATIONS_WORD}:${id}`
        await client.lPush(collKey, id + '')
        await client.hSet(recKey, 'message', caption)
        await client.hSet(recKey, 'author', author)
        console.log(recKey)
        recCount++
    }
    fnCount++
}

console.log(recCount, 'records are pumped')

await client.bgSave()
await client.quit()

console.log('is disconnected')

