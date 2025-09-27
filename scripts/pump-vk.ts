import dotenv from 'dotenv'
import { getDriver, getYDBTimestamp, VKontakte } from '../src/lib/server/ydb'
import { readFileSync } from 'fs';


dotenv.config()

const CREATE_TABLE = true
const TABLE_NAME = 'vkontakte'

function chunkArray(arr: string[], chunkSize: number) {
    const result = new Array<string[]>();
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
}
  
;(async function(){

    const date = new Date()
    const values = chunkArray(readFileSync('.data/vk.txt', 'utf8').trim().split(/[\r\n]+/).filter(row => /^\d+$/.test(row)).map(id => {
        const secs = date.getSeconds()
        date.setSeconds(secs + 1)
        return ` (${id}, ${getYDBTimestamp(date)})`
    }), 100)
    
    
    const driver = await getDriver()

    await driver.tableClient.withSession(async (session) => {

        if(CREATE_TABLE) {
            await session.dropTable(TABLE_NAME)
            await session.createTable(TABLE_NAME, new VKontakte())
        }

        for(const chunk of values){
            const query = `upsert into ${TABLE_NAME} (id, ts) values ${chunk.join(', ')}`
            console.log(query.slice(0, 180) + '...')
            await session.executeQuery(query)
        }
    })

    await driver.destroy()

})()
