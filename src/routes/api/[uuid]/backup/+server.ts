import { checkConnection } from '$lib/server'
import { exec } from 'child_process'

const backup = () => new Promise((yep, nop) => {
    const date = new Date().toISOString().slice(0, -5)
    //const cmd = `/usr/local/bin/aws --endpoint-url="https://storage.yandexcloud.net" s3 cp "/data/dump.rdb" "s3://random-history/backup/${date}.rdb"`
    const cmd = `cp /data/dump.rdb /mnt/backup/dump-${date}.rdb`
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return nop();
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return yep(true)
    })
})

export const GET = async () => {
    const client = await checkConnection()
    await client.bgSave()
    await backup()
    return new Response()
}
