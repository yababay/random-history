import { getNextPictureId, uploadFromBlob } from '$lib/server'

export async function POST ({request}){
    const body = await request.text()
    const arr = /^data:image\/([\w\d]+);base64,(.*)$/.exec(body)
    if(!arr) throw 'The picture is bad encoded'
    const [ _, ext, picture ] = arr
    if(!(ext && picture)) throw 'No extension and picture found.'
    const fileName = await getNextPictureId()
    const key = await uploadFromBlob(picture, fileName, ext)
    return new Response(key)
}
