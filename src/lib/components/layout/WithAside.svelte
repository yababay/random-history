<script lang="ts">
    export let title: string = ''
</script>

<div class="layout-with-aside">

    <aside>
        <slot name="aside" />
    </aside>
    
    <section>
        <slot />
    </section>
</div>

<style lang="scss">

    @use './styles/settings' as *;

    .layout-with-aside {
        width: 100%;
        min-height: calc(100vh - $header-height);
        display: grid;
        grid-template:
            "aside section" auto / $aside-width auto;

        aside {
            margin-left: .5rem;
            grid-area: aside;
        }

        section {
            grid-area: section;
        }
    }
</style>

<svelte:head>
    {#if title}
        <title>{title}</title>
    {/if}
</svelte:head>
