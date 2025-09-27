import { Client } from 'pg'
import dotenv from 'dotenv'
import { getDriver, getYDBTimestamp, RandomHistory } from '../src/lib/server/ydb'


dotenv.config()

const CREATE_TABLE = false

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
    const queryPrefix = `upsert into ${YDB_TABLE_NAME} (id, collection, link, message, tags, ts)`
    const date = new Date()
    await driver.tableClient.withSession(async (session) => {
        if(CREATE_TABLE) {
            await session.dropTable(YDB_TABLE_NAME)
            await session.createTable(YDB_TABLE_NAME, new RandomHistory())
        }
        let count = 0
        for(const row of rows){
            const { id, link, message, tags, collection } = row
            const _tags = Array.isArray(tags) && tags.length ? tags.map(t => `#${t}`).join(' ') : null
            let secs = date.getSeconds()
            secs++
            date.setSeconds(secs)
            const queryPostfix = `values (${id}, '${collection}', '${link}', '${message.replaceAll("'", "`")}', '${_tags}', ${getYDBTimestamp(date)})`
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
