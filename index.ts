import { YC } from './yc'
import { sendMessage } from './src/lib/server/telegram';
import { getDriver, getNextRow, setLatest } from './src/lib/server/ydb'

export async function handler(event: YC.CloudFunctionsHttpEvent) {

  const { queryStringParameters } = event

  let collection: string

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

  if (!collection) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: `Необходимо указать параметр collection: ${queryStringParameters}`,
      isBase64Encoded: false,
    };
  }

  const driver = await getDriver();

  const id = await driver.tableClient.withSession(async (session) => {
    const record = await getNextRow(session, collection)
    const { id } = record
    await sendMessage(record)
    await setLatest(session, id)
    return id
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

