import { tgDebug } from "$lib/server/telegram.js"
import { redirect } from "@sveltejs/kit"

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData()
        const token = data.get('token')?.toString().trim()
        const age = data.get('age')?.toString().trim()
        if(!(token && age)) {
            const msg = `bad token ${token} or age ${age}` 
            await tgDebug(msg)
            throw msg
        }
        const maxAge = +age
        if(isNaN(maxAge)) {
            const msg = `age ${age} is not a number` 
            await tgDebug(msg)
            throw msg
        }
        cookies.set('access_token', token, { path: '/', maxAge })
        throw redirect(302, '/')
    }
}
