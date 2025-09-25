import { Client } from 'pg'
import dotenv from 'dotenv'
import { getDriver, getYDBTimestamp } from '../src/server/ydb'


dotenv.config()

const { POSTGRES_CONNECTION_STRING, YDB_TABLE_NAME } = process.env
if(!(POSTGRES_CONNECTION_STRING && YDB_TABLE_NAME)) throw 'bad config'

const pgClient = new Client({
    connectionString: POSTGRES_CONNECTION_STRING
});

(async function(){
    await pgClient.connect()
    const query = 'select * from to_ydb limit 200'
    const result = await pgClient.query(query)
    const { rows } = result
    console.log('rows count =', rows.length)
    const driver = await getDriver()
    const queryPrefix = `upsert into ${YDB_TABLE_NAME} (id, link, message, tags, ts)`
    const date = new Date()
    await driver.tableClient.withSession(async (session) => {
        let count = 0
        for(const row of rows){
            const { id, link, message, tags } = row
            const _tags = Array.isArray(tags) && tags.length ? tags.map(t => `#${t}`) : ''
            let secs = date.getSeconds()
            secs++
            date.setSeconds(secs)
            const queryPostfix = `values (${id}, '${link}', '${message.replaceAll("'", "`")}', '${_tags}', ${getYDBTimestamp(date)})`
            const query = `${queryPrefix} ${queryPostfix}`
            await session.executeQuery(query)
            await pgClient.query(`update messages set used = true where id = ${id}`)
            if(++count % 10) continue
            await new Promise((yep) => setTimeout(() => {
                    console.log(query.slice(0, 80))
                    yep(true)
                }, 1000)
            )
        }

    })
    await driver.destroy()
    await pgClient.end()
})()
