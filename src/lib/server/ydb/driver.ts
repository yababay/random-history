import {AnonymousAuthService, Driver, TokenAuthService} from 'ydb-sdk'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const { ENDPOINT, DATABASE } = process.env

if(!(ENDPOINT && DATABASE)) throw 'bad env'

export async function getDriver(local: boolean = true) {

  console.log('Driver initializing...');
  const driver = new Driver({endpoint: ENDPOINT, database: DATABASE, authService:  new AnonymousAuthService()});
  const timeout = 10000;
  if (!await driver.ready(timeout)) {
    console.error(`Driver has not become ready in ${timeout}ms!`);
    process.exit(1);
  }

  return driver
}  
