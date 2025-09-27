import { sendMessage, getDriver, getNextRecord, nextIdFromCollection, postMessageToChat } from '../src/lib/server'

;(async function(){

    const driver = await getDriver()

    await driver.tableClient.withSession(async (session) => {
        const id = await nextIdFromCollection(session)
        const record = await getNextRecord(session, id)
        const { link, message } = record
        if(!(link && message)) {
            console.log('no link')
            return
        }
        await postMessageToChat(message, link)
    })

    await driver.destroy()

})()
