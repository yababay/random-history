import { Driver, TokenAuthService } from 'ydb-sdk';

export async function getYDBDriver(endpoint: string, database: string, token: string) {
    const authService = new TokenAuthService(token);
    const driver = new Driver({endpoint, database, authService});
    const timeout = 10000;
    if (!await driver.ready(timeout)) {
        console.log(`Driver has not become ready in ${timeout}ms!`);
        process.exit(1);
    }
    console.log('Driver connected')
    return driver
}