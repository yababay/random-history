<script lang="ts">

    import type { MenuItems } from '../menu/types.js'
    import WithHeader from './WithHeader.svelte'
    import Menu from '../menu/index.svelte'

    export let items: MenuItems | undefined = undefined
    export let brand: string | undefined = undefined
    export let icon: string | undefined = undefined
    export let title: string = ''

</script>

<WithHeader>
    <Menu {items} {brand} {icon} slot="header"/>
    <slot />
</WithHeader>

<svelte:head>
    {#if title}
        <title>{title}</title>
    {/if}
</svelte:head>
