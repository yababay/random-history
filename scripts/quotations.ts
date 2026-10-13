import { readFileSync, existsSync } from 'fs'
import { getDriver, getYDBTimestamp } from '../src/server/ydb'
import { TableSession } from 'ydb-sdk';

const MAX_ID = 63737;
const QUOTATIONS_WORD = 'quotations'

let fnCount = 1

const getFileName = () => {
    let suffix = `${fnCount}`
    if(fnCount < 100 && fnCount > 9) suffix = `0${fnCount}`
    else if (fnCount < 10) suffix = `00${fnCount}`
    return `../eloquence/static/${QUOTATIONS_WORD}-${suffix}.json`
}

type MessageWithAuthor = { russian: { caption: string, author: string }, ts: Date}

const date = new Date()

;(async function(){

    const quotations = new Map<number, MessageWithAuthor>()

    let count = MAX_ID

    while(fnCount <= 22) {
        const fn = getFileName()
        //console.log(fn)
        if(!existsSync(fn)) throw `no such file: ${fn}`
        const json = readFileSync(fn, 'utf8')
        const obj = JSON.parse(json) as MessageWithAuthor[]
        if(!Array.isArray(obj)) throw `bad array ${typeof obj}`
        for(const quot of obj) {
            count++
            const { russian } = quot
            const { author, caption } = russian
            if(!(typeof author === 'string' && typeof caption === 'string')) throw `bad author or caption`
            let secs = date.getSeconds()
            secs++
            date.setSeconds(secs)
            quotations.set(count, { ...quot, ts: new Date(date)})
        }
        fnCount++
    }

    console.log(quotations.size, 'quotations, max = ', count)

    const driver = await getDriver()
    const ids = new Set<number>()
    const distill = (s: string | null | undefined) => s ? `'${s.replaceAll("'", "`")}'` : 'null'

    const checkIds = async (session: TableSession, shift: number = 0) => {
        const query = `select id from messages where collection = 'quotations' and id > ${MAX_ID + shift} order by id`
        const { resultSets } = await session.executeQuery(query);
        const [ resultSet ]  = resultSets
        const { rows } = resultSet
        const arr = rows?.map(({items}) => items)
        arr?.forEach(items => {
            for(const item of items || []){
                const { int32Value } = item
                if(typeof int32Value === 'number') ids.add(int32Value)
            }
        })
    }

    await driver.tableClient.withSession(async (session) => {
        await checkIds(session)
        await checkIds(session, 1000)
        const arr = Array.from(quotations.keys()).filter(key => !ids.has(key))
        console.log(arr.length, 'are absent')

        for(let i = 0; i < arr.length; i +=20){
            let query = `upsert into messages (id, message, author, collection, ts) values `
            const values = arr.slice(i, i + 20).map(id => {
                const quot = quotations.get(id)
                if(!quot) throw 'no quot'
                const { russian, ts } = quot
                const { author, caption } = russian
                //if(!(author && caption)) throw ''
                return `(${id}, ${distill(caption)}, ${distill(author)}, '${QUOTATIONS_WORD}', ${getYDBTimestamp(ts)})`
            })
            query += values.join(', ')
            console.log(query.slice(0, 80))
            try {
                await session.executeQuery(query)
            }
            catch(err){
                console.log(err)
            }
        }
    })
    await driver.destroy()
})()
