import { VK } from 'vk-io'
import dotenv from 'dotenv'

dotenv.config()

const { VK_API_GROUP_KEY, VK_DEFAULT_CHAT } = process.env

if(!(VK_API_GROUP_KEY && VK_DEFAULT_CHAT)) throw 'bad env'

const vk = new VK({
    token: VK_API_GROUP_KEY
})

const getRandomId = () => Math.round(Math.random() * 1000000)

export async function postMessageToChat(message: string, url: string, chat_id = +VK_DEFAULT_CHAT) {
    try {
        await vk.api.messages.send({
            chat_id,
            message,
            attachment: await attachmentForChat(url),
            random_id: getRandomId()
        });
        console.log(`Message successfully sent to chat ${chat_id}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

const attachmentForChat = async (fn: string) => {
    const { id, ownerId } = await vk.upload.messagePhoto(
        {
            source: {
                value: fn
            }
        }
    )
    return `photo${ownerId}_${id}`
}
