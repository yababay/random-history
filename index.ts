import { YC } from './yc'
import { setLatest, sendMessage, getDriver, getNextRecord, nextIdFromCollection, postMessageToChat } from './src/lib/server'

export async function handler(event: YC.CloudFunctionsHttpEvent) {

  const { queryStringParameters } = event

  let collection: string | null = null

  if (queryStringParameters && typeof queryStringParameters.collection === 'string') collection = queryStringParameters.collection
  else {
    const details = Reflect.get(event, 'details')
    if(details && typeof details === 'object') collection = Reflect.get(details, 'payload')
  }

  if(!collection) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: `Функции не переданы параметры`,
      isBase64Encoded: false,
    };
  }

  const driver = await getDriver();

  const id = await driver.tableClient.withSession(async (session) => {
    
    if(collection === 'vk') {
      const id = await nextIdFromCollection(session)
      const record = await getNextRecord(session, id)
      const { link, message } = record
      if(!(link && message)) {
          console.log('no link')
          return
      }
      await postMessageToChat(message, link)
      return id
    }
    else {
        const record = await getNextRecord(session, collection)
        const { id } = record
        console.log('publishing', id, '…')
        await sendMessage(record)
        await setLatest(session, id)
        return id
    }
})

  await driver.destroy()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: { id, collection },
    isBase64Encoded: false,
  };
}

