import { API_KEY } from '$env/static/private'
import { tgDebug } from '$lib/server/telegram.js'

export const actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData()
        let collection = data.get('collection')?.toString()
        const vk = !!data.get('vk')?.toString()
        if(vk && collection !== 'quotations') collection = 'vk'
        const admin = !!data.get('admin')?.toString()
        let url = `/api/${API_KEY}/collection/${collection}/next`
        if(admin) url += '?admin=true'
        const status = await fetch(url).then(res => res.status)
        if(status !== 200) {
            const msg = `bad publication status: ${status || 500}`
            await tgDebug(msg)
            throw msg
        }
        return {foo: 'bar'}
    }
}
