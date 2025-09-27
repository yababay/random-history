export type MenuItem = {
    title: string
    href?: string
    icon?: string
    items?: MenuItems
}

export type MenuItems = MenuItem[]
