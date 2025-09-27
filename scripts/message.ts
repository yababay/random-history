import { sendMessage } from '../src/lib/server/telegram';
import { getDriver, getNextRecord, setLatest } from '../src/lib/server/ydb'

;(async function(){

    const driver = await getDriver()

    await driver.tableClient.withSession(async (session) => {
        const record = await getNextRecord(session)
        const { id } = record
        await sendMessage(record)
        await setLatest(session, id)
    })

    await driver.destroy()

})()
