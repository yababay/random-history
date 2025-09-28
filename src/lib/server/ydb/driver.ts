import YDB from 'ydb-sdk'
import axios from 'axios'
import { YDB_ACCESS_TOKEN_CREDENTIALS, YDB_ENDPOINT, YDB_DATABASE, YANDEX_OAUTH_TOKEN } from '$env/static/private'
import { dev } from '$app/environment'

const {Driver, TokenAuthService} = YDB

let accessToken = YDB_ACCESS_TOKEN_CREDENTIALS
const database  = YDB_DATABASE
const endpoint  = YDB_ENDPOINT

const setupToken = async () => {
  const { data } = await axios.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', {"yandexPassportOauthToken": YANDEX_OAUTH_TOKEN})
  const { iamToken } = data
  if(typeof iamToken !== 'string') throw 'bad iam token'
  accessToken = iamToken
}

export async function getDriver(local: boolean = true) {

  if(dev) console.log('Driver initializing...');
  await setupToken()
  const authService = new TokenAuthService(accessToken)
  const driver = new Driver({endpoint, database, authService});
  const timeout = 10000;
  if (!await driver.ready(timeout)) {
    if(dev) console.error(`Driver has not become ready in ${timeout}ms!`);
    process.exit(1);
  }

  return driver
}  