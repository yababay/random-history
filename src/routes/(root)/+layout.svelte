<script lang="ts">

	import { page } from '$app/state'
	import favicon from '$lib/assets/favicon.svg'
	import BareLayout from '$lib/components/layout/Bare.svelte'

	const isRoot  = page.url.pathname === '/'
	const isLocal  = page.url.hostname === 'localhost'

	let { children } = $props()

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Random History</title>
</svelte:head>

<div class="position-absolute mt-3 ms-3 fs-3">
		{#if !isRoot}
			<a href="/" rel="external" class="link-primary" aria-label="home" title="На главную">
				<i class="bi bi-house"></i>
			</a>
		{:else if isLocal}
			<a href="/publish" rel="external" class="link-primary" aria-label="publish" title="Публиковать">
				<i class="bi bi-play"></i>
			</a>
	{/if}
</div>

<BareLayout>
	{@render children?.()}
</BareLayout>
