import type { Collection } from "./words"

export type MessageAttributes = {
    id: number
    collection: Collection
    message: string 
    used: boolean
    tags?: string[] | null
    notes?: string
    back?: string
    link?: string
}

export type MediaAttributes = {
    messageId: number
    link: string
}

export type WritingAttributes = {
    messageId: number
    author: string
    source: string
}

export type MediaAttributesJoin = Omit<MessageAttributes & MediaAttributes, 'messageId'>
export type WritingAttributesJoin = Omit<MessageAttributes & WritingAttributes, 'messageId'>

export type PageAttributes = MediaAttributesJoin | WritingAttributesJoin

type IdAndCollection = 'id' | 'collection' //| 'used'

export type MediaCreateAttributes   = Omit<MediaAttributesJoin, IdAndCollection>
export type WritingCreateAttributes = Omit<WritingAttributesJoin, IdAndCollection>
export type MessageCreateAttributes = Omit<MessageAttributes, IdAndCollection>
export type CreateAttributes = MediaCreateAttributes | WritingCreateAttributes | MessageCreateAttributes

export const emptyMedia: MediaCreateAttributes = {
    link: '',
    message: '',
    used: false
}

export const emptyWriting: WritingCreateAttributes = {
    message: '',
    author: '',
    source: '',
    used: false
}

export type MessageFilters = {tags?: null, used?: boolean}
