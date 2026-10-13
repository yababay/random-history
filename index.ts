import { YC } from './yc'
import { setLatest, sendMessage, getDriver, getNextRecord, nextIdFromCollection } from './src/lib/server'

(async function handler() {

  let collection: string | null | undefined = process.argv[2]

  if(!collection) {
	  console.log('no collection')
	  process.exit(1)
  }

  try {
	  const driver = await getDriver();

	  const id = await driver.tableClient.withSession(async (session) => {
	    
		const record = await getNextRecord(session, collection)
		const { id } = record
		console.log('publishing', id, '…')
		await sendMessage(record)
		await setLatest(session, id)
		return id
	  })

	  await driver.destroy()
  }
  catch(e){
  	console.log(e)
	process.exit(1)
  }
  finally {
	process.exit(0)
  }
})()

