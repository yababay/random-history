<script lang="ts">

    import WithMenu from './WithMenu.svelte'
    import WithAside from './WithAside.svelte'
    import type { MenuItems } from '../menu/types.js'

    export let items: MenuItems | undefined = undefined
    export let brand: string | undefined = undefined
    export let icon: string | undefined = undefined
    export let title: string = ''

</script>

<WithMenu {items} {brand} {icon} {title}>
    <WithAside>
        <slot name="aside" />
        <slot />
    </WithAside>
</WithMenu>

<svelte:head>
    {#if title}
        <title>{title}</title>
    {/if}
</svelte:head>
