import { exec } from 'child_process'
import { checkConnection } from './db'

export const restore = () => new Promise((yep, nop) => {
    const date = new Date().toISOString().slice(0, -5)
    const cmd = `cp /mnt/backup/dump.rdb /data/dump.rdb`
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

export const backup = async (ts: Date = new Date(), onlyHours = false) => {
    const client = await checkConnection()
    await client.bgSave()
    await new Promise((yep, nop) => {
        const date = onlyHours ? `${ts.toISOString().slice(0, -11)}:00:00` : ts.toISOString().slice(0, -5)
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
}