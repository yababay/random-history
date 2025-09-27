<script lang="ts">
    export let title: string = ''
</script>

<div class="bare-layout">
    <slot />
</div>

<style lang="scss">
    .bare-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<svelte:head>
    {#if title}
        <title>{title}</title>
    {/if}
</svelte:head>
