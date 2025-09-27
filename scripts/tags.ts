import { getDriver, Tags } from '../src/lib/server/ydb'
import { readFileSync } from 'fs';

const CREATE_TABLE = true
const TABLE_NAME = 'tags'
  
;(async function(){

    const arr = readFileSync('.data/tags.txt', 'utf8').trim().split(/[\r\n]+/).filter(row => /^[А-Яа-я0-9_]+$/.test(row))
    const values = Array.from(new Set(arr)).map(tag => {
        return ` ('${tag}')`
    })
    
    console.log(arr.length, values.length)
    
    const driver = await getDriver()

    await driver.tableClient.withSession(async (session) => {

        if(CREATE_TABLE) {
            await session.dropTable(TABLE_NAME)
            await session.createTable(TABLE_NAME, new Tags())
        }

        const query = `upsert into ${TABLE_NAME} (tag) values ${values.join(', ')}`
        console.log(query.slice(0, 180) + '...')
        await session.executeQuery(query)

    })

    await driver.destroy()

})()
