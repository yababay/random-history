import { API_KEY } from '$env/static/private'
import { getNextRecord, sendMessage } from '$lib/server'
import { chatPost } from '$lib/server/vk/upload.js'

export const GET = async ({ params }) => {
    const { uuid, collection } = params
    if(uuid !== API_KEY) return new Response('Not allowed', {status: 401})
    const props = await getNextRecord(collection)
    if(collection === 'vk') {
        const { message, link } = props
        await chatPost(message, link)
    }
    else await sendMessage(props)
    return new Response()
}
