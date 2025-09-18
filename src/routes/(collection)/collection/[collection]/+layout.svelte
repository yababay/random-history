<script lang="ts">

    import { LayoutWithMenu } from '@yababay67/sveltekit-components'
    import { collectionsMenu, getTitle, type Collection } from '$lib/types'
	import favicon from '$lib/assets/dice-12.svg'

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
            htef:  '/publish',
            icon:  'caret-right'            
        },
        {
            title: 'Github',
            htef:  'https://github.com/yababay/random-history',
            icon:  'github'            
        },
        {
            title: 'Телеграм',
            htef: 'https://t.me/random_historical_picrures',
            icon: 'telegram'            
        }
    ]

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<LayoutWithMenu {brand} {title} {items}>
    <slot />
</LayoutWithMenu>