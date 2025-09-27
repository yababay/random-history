import fs from 'fs'
import axios from 'axios'
import { VK } from 'vk-io'
import { VK_API_GROUP_KEY, VK_GROUP_ID, VK_DEFAULT_CHAT } from '$env/static/private'
import { checkConnection } from '../db/redis'

const client = await checkConnection()
//const apiPrefix = 'https://api.vk.com/method'
const apiPrefix = 'https://api.vk.ru/method'

const vk = new VK({
    token: VK_API_GROUP_KEY
})

const group_id = +VK_GROUP_ID
const owner_id = group_id * -1
const access_token = VK_API_GROUP_KEY
const v = '5.131'
const getRandomId = () => Math.round(Math.random() * 1000000)

export const pullApi = async (apiPostfix: string, body: {[key: string]: string | number} = {}, withKey = true) => {
    if(withKey) body = { ...body,  access_token, v }
    return await axios.post(`${apiPrefix}/${apiPostfix}`, body, { headers: { 'Content-Type': 'multipart/form-data' }})
}

export const wallPost = async (message: string) => {
    return await pullApi('wall.post', { owner_id, message })
}

export const wallPostWithPicture = async (message: string, url: string = '', owner_id = +VK_GROUP_ID * -1) => {
    let props: {[key: string]: string | number} = { owner_id, text: message, random_id: getRandomId() }
    if(url) {
        const fn = await downloadImage(url)
        const attachments = await attachmentForWall(fn)
        props = { ...props, attachments }
    }
    return await pullApi('wall.post', props)
}

export const chatPost = async (message: string, url: string = '', peer_id = +VK_DEFAULT_CHAT + 2000000000) => {
    let props: {[key: string]: string | number} = { peer_id, message, random_id: getRandomId() }
    if(url) {
        const fn = await downloadImage(url)
        const attachment = await attachmentForChat(fn)
        props = { ...props, attachment }
    }
    return await pullApi('messages.send', props)
}

export const getChats = async () => {
    return await pullApi('messages.getConversations', { group_id })
}

export const attachmentForChat = async (fn: string) => {
    const { id, ownerId } = await vk.upload.messagePhoto(
        {
            source: {
                value: fn
            }
        }
    )
    fs.unlinkSync(fn)
    return `photo${ownerId}_${id}`
}

export const attachmentForWall = async (fn: string) => {
    const { id, ownerId } = await vk.upload.wallPhoto(
        {
            source: {
                value: fn
            }
        }
    )
    fs.unlinkSync(fn)
    return `photo:${ownerId}_${id}`
}

export const fileNameFromUrl = (url: string) => {
    let [ _, fn ] = /.*\/([^\/]+)$/.exec(url) || []
    fn = `/tmp/${fn}`
    return fn
}

export const downloadImage = async (url: string = 'http://bit.ly/2mTM3nY') => { //'https://historical-pictures.website.yandexcloud.net/media/173547344388_0.jpg') => {
    const fn = fileNameFromUrl(url)
    await axios({
        url,
        method: 'GET', // or POST, depending on your API
        responseType: 'stream', // Important: tells Axios to expect a Blob
      })
      .then(function (response) {
            const { data } = response
            const ws = fs.createWriteStream(fn)
            data.pipe(ws)
            return ws
       })
       .then(ws => new Promise<void>((yep, nop) => {
            ws.on('finish', yep)
       }))
       return fn
}
