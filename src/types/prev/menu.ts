export type MenuItem = {
    title: string
    id?: string
    href?: string
    icon?: string
    items?: MenuItem[]
}

export type Menu = { menu: MenuItem[] }
