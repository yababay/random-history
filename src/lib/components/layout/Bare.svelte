<script lang="ts">

	import favicon from '$lib/assets/favicon.svg'
    let { title, children } = $props()
    
</script>

<div class="bare-layout">
	{@render children?.()}
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
	<link rel="icon" href={favicon} />
    {#if title}
        <title>{title}</title>
    {/if}
</svelte:head>
