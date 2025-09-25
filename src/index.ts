import { YC } from './yc'; 
//import { getDriver, getMaxId } from './server/ydb';
//import { Driver, MetadataAuthService } from 'ydb-sdk';

const { ENDPOINT, DATABASE } = process.env

if(!(ENDPOINT && DATABASE)) throw 'bad env'

const database = DATABASE
const endpoint = ENDPOINT
//const authService = new MetadataAuthService()

export async function handler(event: YC.CloudFunctionsHttpEvent, context: YC.CloudFunctionsHttpContext) {
  // возможно Вы захотите передать в функцию какие то параметры в get строке
  const { collection } = event.queryStringParameters;

  if (!collection) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: { error: 'Вам необходимо указать параметр collection' },
      isBase64Encoded: false,
    };
  }

  /*const driver = new Driver({endpoint, database, authService});
  const timeout = 10000;
  if (!await driver.ready(timeout)) {
    console.error(`Driver has not become ready in ${timeout}ms!`);
    process.exit(1);
  }*/

  let id = -1

  /*await driver.tableClient.withSession(async (session) => {
    id = await getMaxId('messages', session)
  })*/

  //await driver.destroy();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: { info: `Выбрана запись с id=${id}` },
    isBase64Encoded: false,
  };
}
