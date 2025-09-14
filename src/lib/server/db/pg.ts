import { type MessageAttributes } from '$lib/types'
import { POSTGRES_CONNECTION_STRING } from '$env/static/private';
import { PUBLIC_POSTGRES_COLLECTION } from '$env/static/public'
import { Client, type QueryResult } from 'pg'
import { checkConnection, getQueueKey } from './redis'

const client = new Client({
  connectionString: POSTGRES_CONNECTION_STRING
})

await client.connect()

export const getPublication = async () => {
  const redis = await checkConnection()
  const key = getQueueKey()
  const id = await redis.rPopLPush(key, key)
  if(!id) throw 'no id for publication'
  const query = `select * from publication where id = ${id}`
  //console.log(query)
  const result = (await client.query(query)) as QueryResult<MessageAttributes>
  //console.log(result)
  const [ record ] = result.rows
  if(!record) throw 'no record for publication'
  return record
}

export const getOldestDraft = async (): Promise<MessageAttributes> => {
    const result = await client.query(`select * from oldest_${PUBLIC_POSTGRES_COLLECTION}`)
    const [ record ] = result.rows
    if(!(record && typeof record === 'object')) throw 'bad record'
    return record as MessageAttributes
}

const justNow = () => new Date().toISOString().replace('T', ' ').slice(0, -1) + '+03'

export const skipRecord = async (id: number) => {
  const query = {
    name: 'skip-record',
    text: 'update messages set "updatedAt"=$1::timestamptz where id=$2::integer',
    values: [justNow(), id],
    rowMode: 'array',
  }
  await client.query(query)
}

export const updateMessages = async (id: number, message: string, collection: string, tags: string[]) => {
  const query = {
    name: 'update-messages',
    text: 'update messages set message=$1::text, collection=$2::varchar, tags=$3::varchar[], "updatedAt"=$4::timestamptz where id=$5::integer',
    values: [message, collection, tags, justNow(), id],
    rowMode: 'array',
  }
  await client.query(query)
}
