import { dev } from '$app/environment'
import { saveRecord } from "$lib/server"

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData()
        console.log(`saving`)
        const id = await saveRecord(data)
        if(dev) console.log(`record with id ${id} is saved`)
        return { id }
    }
}
