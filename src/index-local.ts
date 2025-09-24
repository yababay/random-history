// это файл для тестирования с локального компьютера
// запускайте его для проверки и тестирования своего кода перед развертыванием функции
//import { driver, initDb } from './database';
import { createClientTable, insertValues, selectMax } from './queries/clients-table';
import {Driver, Logger, TokenAuthService} from 'ydb-sdk'
import dotenv from 'dotenv'

dotenv.config()

const { YDB_ACCESS_TOKEN_CREDENTIALS, ENDPOINT, DATABASE } = process.env

if(!(YDB_ACCESS_TOKEN_CREDENTIALS && ENDPOINT && DATABASE)) throw 'bad env'

async function main() {
  console.log('Driver initializing...');

  const accessToken = YDB_ACCESS_TOKEN_CREDENTIALS
  const database = DATABASE
  const endpoint = ENDPOINT

  const authService = new TokenAuthService(accessToken);
  const driver = new Driver({endpoint, database, authService});
  const timeout = 10000;
  if (!await driver.ready(timeout)) {
    console.error(`Driver has not become ready in ${timeout}ms!`);
      process.exit(1);
  }
  console.log('Done');  
  
  
  //await initDb();

  const apiKey = 'apiKey22';
  await createClientTable(driver, apiKey);
  await insertValues(driver, apiKey);
  console.log(await selectMax(driver, apiKey))
  await driver.destroy();
}

main();
