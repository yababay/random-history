import { API_KEY } from '$env/static/private'

export const actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData()
        let collection = data.get('collection')?.toString()
        const vk = !!data.get('vk')?.toString()
        if(vk && collection !== 'quotations') collection = 'vk'
        const admin = !!data.get('admin')?.toString()
        let url = `/api/${API_KEY}/collection/${collection}/next`
        if(admin) url += '?admin=true'
        return {foo: 'bar'}
    }
}
