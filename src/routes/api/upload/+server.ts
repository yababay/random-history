import { dev } from '$app/environment'
import { uploadFromBlob } from '$lib/server'
import { getMaxId } from '$lib/server'
import YDB from 'ydb-sdk'

export async function POST ({request, locals }){
    const body = await request.text()
    const arr = /^data:image\/([\w\d]+);base64,(.*)$/.exec(body)
    if(!arr) throw 'The picture is bad encoded'
    const [ _, ext, picture ] = arr
    if(!(ext && picture)) throw 'No extension and picture found.'
    const { driver } = locals
    const id = await driver.tableClient.withSession(async (session: YDB.TableSession) => {
        return (await getMaxId(session)) + 1
    })
    const key = await uploadFromBlob(picture, id, ext)
    if(dev) console.log(`image with id ${id} is uploaded`)
    return new Response(key)
}
