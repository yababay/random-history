import * as fs from 'fs'
import { dev } from '$app/environment'
import { toByteArray } from 'base64-js'
import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { 
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_BUCKET,
    AWS_DEFAULT_REGION,
    AWS_ENDPOINT

} from '$env/static/private'
import { tgDebug } from './telegram'

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
    if(dev) console.log(`${Key}`, 'is uploaded')
    return Key
}

const bucketName = "random-history";
const keyName = "backup/dump.rdb"; // The path to the file in your S3 bucket

export async function uploadBackup(body: string, fileName: number, extension: string){
  const Body = toByteArray(body)
  const Key = `media/${fileName}.${extension}`
  const command = new PutObjectCommand({ Bucket, Key, Body})
  await s3Client.send(command)
  if(dev) console.log(`${Key}`, 'is uploaded')
  return Key
}


export const restoreFromBucket = async () => {
    if(fs.existsSync('.svelte-kit')) return
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: keyName,
    });

    const data = await s3Client.send(command);

    const { Body } = data

    if(Body) fs.writeFileSync("/data/dump.rdb", await Body.transformToByteArray());

    await tgDebug("Dump downloaded successfully.")
  } catch (err) {
    console.error("Error downloading file:", err);
  }
};