import { Telegram } from 'telegraf'
import type { ParseMode } from 'telegraf/types'
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL, TELEGRAM_ADMIN_CHANNEL } from '$env/static/private'
import type { RandomHistory } from '$lib/types'
import { dev } from '$app/environment'

if(!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHANNEL)) throw 'please setup telegram token and channel'

const TG = new Telegram(TELEGRAM_BOT_TOKEN)

const channel = dev ? TELEGRAM_ADMIN_CHANNEL : TELEGRAM_CHANNEL

type MessageOptions = {
    parse_mode: ParseMode,
    caption?: string,
    link_preview_options: {is_disabled: boolean}
}

const OPTIONS: MessageOptions = {
    parse_mode: 'Markdown',
    link_preview_options: {is_disabled: true}
}

export const sendMessage = async (content: RandomHistory) => {
    let { link, message, tags } = content
    tags = Array.isArray(tags) ? tags.join(' ') : tags
    tags = tags?.trim()
    let caption = message.trim() + (tags ? `\n\n${tags}` : '')
    const options: MessageOptions = { ...OPTIONS, caption }
    await TG.sendPhoto(channel, link, options)
}
