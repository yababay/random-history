<script lang="ts">

    import { page } from '$app/state'
    import LayoutWithMenu from '$lib/components/layout/WithMenu.svelte'
    import { collectionsMenu, getTitle, type Collection } from '$lib/types'
	import favicon from '$lib/assets/favicon.svg'

	const isLocal = page.url.hostname === 'localhost'

    export let data: { collection: Collection }

    const { collection } = data
    const brand = getTitle(collection)
    const title = `Коллекция «${brand}»`
    const items = [
        {
            title: 'Коллекции',
            icon: 'collection-fill',
            items: collectionsMenu
        },
        {
            title: 'Публиковать',
            href:  '/publish',
            icon:  'caret-right'            
        },
        {
            title: 'Github',
            href:  'https://github.com/yababay/random-history',
            icon:  'github'            
        },
        {
            title: 'Телеграм',
            href: 'https://t.me/random_historical_picrures',
            icon: 'telegram'            
        }
    ].filter(({href}) => isLocal || !href?.includes('/publish'))

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<LayoutWithMenu {brand} {title} {items}>
    <slot />
</LayoutWithMenu>
