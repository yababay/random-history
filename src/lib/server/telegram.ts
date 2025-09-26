import { Telegram } from 'telegraf'
import type { ParseMode } from 'telegraf/types'
import type { RandomHistoryRecord } from '../types'
import dotenv from 'dotenv'

dotenv.config()

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL, TELEGRAM_ADMIN_CHANNEL } = process.env

if(!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHANNEL && TELEGRAM_ADMIN_CHANNEL)) throw 'please setup telegram token and channel'

const TG = new Telegram(TELEGRAM_BOT_TOKEN)

type MessageOptions = {
    parse_mode: ParseMode,
    caption?: string,
    link_preview_options: {is_disabled: boolean}
}

const OPTIONS: MessageOptions = {
    parse_mode: 'Markdown',
    link_preview_options: {is_disabled: true}
}

export const tgDebug = async (message: string) => {
    await TG.sendMessage(TELEGRAM_ADMIN_CHANNEL, message)
}

export const sendMessage = async (content: RandomHistoryRecord) => {
    const channel = TELEGRAM_ADMIN_CHANNEL //: TELEGRAM_CHANNEL
    let { link, message, tags, author } = content
    if(typeof author === 'string'){
        const options: MessageOptions = { ...OPTIONS, parse_mode: 'HTML' }
        const caption = `<blockquote>${message}</blockquote>\n\n${author}.`.replace('..', '.')
        await TG.sendMessage(channel, caption, options)
        return
    }
    if(typeof link !== 'string') throw 'link or author must be defined'
    tags = Array.isArray(tags) ? tags.join(' ') : tags
    tags = tags?.trim()
    let caption = message.trim() + (tags ? `\n\n${tags}` : '')
    const options: MessageOptions = { ...OPTIONS, caption }
    await TG.sendPhoto(channel, link, options)
}
