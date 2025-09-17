export type MenuItem = {
    title: string
    href?: string
    icon?: string
    items?: MenuItems
}

export type MenuItems = MenuItem[]

export type Collection = 'artefacts' | 'art' | 'photo' | 'quotations' | 'funny' | 'maps' | 'cognitive' | 'drafts'

export const COLLECTIONS = ['artefacts', 'art', 'photo', 'quotations', 'funny', 'maps', 'cognitive', 'drafts'] as Collection[]

export const getTitle = (coll: Collection) => {
    switch(coll) {
        case 'artefacts':
            return 'Артефакты'
        case 'art': 
            return 'Живопись'
        case 'photo': 
            return 'Фото'
        case 'quotations': 
            return 'Цитаты'
        case 'funny': 
            return 'Забавные'
        case 'maps': 
            return 'Карты и схемы'
        case 'cognitive':
            return 'Познавательное'
        default: 
            return 'Черновики'
    }
}

export const getIcon = (coll: Collection) => {
    switch(coll) {
        case 'artefacts':
            return 'award'
        case 'art': 
            return 'postage-heart'
        case 'photo': 
            return 'camera'
        case 'quotations': 
            return 'chat-quote'
        case 'funny': 
            return 'emoji-smile'
        case 'maps': 
            return 'compass'
        case 'cognitive':
            return 'search'
        default: 
            return 'pencil'
    }
}

export const collectionsMenu = COLLECTIONS.map(el => {
    const icon = getIcon(el)
    const title = getTitle(el)
    const href = `/collection/${el}`
    return { icon, title, href }
})
