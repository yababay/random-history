import { YC } from './yc'; 
import { getYDBDriver } from './ydb'

const { ENDPOINT, DATABASE, TOKEN } = process.env

if(!(ENDPOINT && DATABASE)) throw 'bad env'

export async function handler(event: YC.CloudFunctionsHttpEvent) {
  const { collection } = event.queryStringParameters;

  if (!collection) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: { error: 'Вам необходимо указать параметр collection' },
      isBase64Encoded: false,
    };
  }

  const driver = await getYDBDriver(ENDPOINT, DATABASE, TOKEN);

  let id = -1

  await driver.tableClient.withSession(async (session) => {
    const query = `select id from messages order by ts desc limit 1`
    const { resultSets } = await session.executeQuery(query);
    const [ resultSet ]  = resultSets
    const { rows } = resultSet
    const [ row ] = rows
    const { items } = row
    const [ item ] = items
    const { int32Value } = item
    id = int32Value
  });

  await driver.destroy();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: { info: `Выбрана запись с id=${id}` },
    isBase64Encoded: false,
  };
}
