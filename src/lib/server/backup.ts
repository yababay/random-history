import { exec } from 'child_process'

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

export const backup = () => new Promise((yep, nop) => {
    const date = new Date().toISOString().slice(0, -5)
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