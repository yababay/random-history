export const collections = <const> [
    'art',
    'artefacts',
    'current',
    'funny',
    'maps',
    'photo',
    'drafts'
]

export type Collection = typeof collections[number]

export const checkCollection = (collection: string): Collection => {
    const found = collections.find(coll => coll === collection)
    if(!found) return collections[collections.length - 1]
    return found as Collection
}

export const getEmoji = (collection: string) => {
    switch(checkCollection(collection)){
        case 'photo': return '📷'
        default: return '🖼️'
    }
}

export const getTitle = (collection: string) => {
    switch(checkCollection(collection)){
        case 'photo': return 'Фотографии'
        case 'art': return 'Живопись, графика'
        case 'artefacts': return 'Артефакты'
        case 'current': return 'Познавательные'
        case 'funny': return 'Забавные'
        case 'maps': return 'Карты и схемы'
        case 'drafts': return 'Черновики'
        default: throw `no title for ${collection}`
    }
}

export const isMedia = (collection: string) => true //!['quotation', 'poetry'].includes(collection)

const VIEW = '_view'

export const MESSAGE_TABLE_NAME  = 'messages'
export const MEDIA_TABLE_NAME    = 'media'
export const WRITINGS_TABLE_NAME = 'writings'
export const TAGS_TABLE_NAME     = 'tags'
export const MEDIA_VIEW_NAME     = `${MEDIA_TABLE_NAME}${VIEW}`
export const WRITINGS_VIEW_NAME  = `${WRITINGS_TABLE_NAME}${VIEW}`
