//import { createReadStream } from 'fs'
//import { decode } from 'js-base64'
import { toByteArray } from 'base64-js'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { 
    //TUMBLR_ROOT_PATH, 
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_BUCKET,
    AWS_DEFAULT_REGION,
    AWS_ENDPOINT

} from '$env/static/private'

//const TUMBLR_MEDIA_PATH = `${TUMBLR_ROOT_PATH}/public/media`
const Bucket = AWS_DEFAULT_BUCKET

const s3Client = new S3Client({ 
    region: AWS_DEFAULT_REGION, 
    endpoint: AWS_ENDPOINT, 
    credentials:{
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
})

export async function uploadFromBlob(body: string, fileName: number, extension: string){
    const Body = toByteArray(body)
    const Key = `media/${fileName}.${extension}`
    const command = new PutObjectCommand({ Bucket, Key, Body})
    await s3Client.send(command)
    console.log(`${Key}`, 'is uploaded')
    return Key
}

/*export async function uploadFromTumblr(picture: string){
    const Key = `media/${picture}`
    const Body = createReadStream(`${TUMBLR_MEDIA_PATH}/${picture}`)
    const command = new PutObjectCommand({ Bucket, Key, Body})
    await s3Client.send(command)
    console.log(`${picture}`, 'is uploaded')
}*/
