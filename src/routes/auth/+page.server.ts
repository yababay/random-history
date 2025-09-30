import { redirect } from "@sveltejs/kit"

export const csr = true

export const actions = {
    default: async ({ request, cookies }) => {

        const data = await request.formData()
        const token = data.get('token')?.toString().trim()
        const age = data.get('age')?.toString().trim()

        if(!(token && age)) throw `bad token ${token} or age ${age}` 

        const maxAge = +age
        
        if(isNaN(maxAge))   throw `age ${age} is not a number` 

        cookies.set('access_token', token, { path: '/', maxAge })

        throw redirect(302, '/')
    }
}
