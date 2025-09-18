<script lang="ts">

	import { page } from '$app/state'
	import favicon from '$lib/assets/dice-12.svg'
	import { BareLayout } from '@yababay67/sveltekit-components'

	const isRoot = page.url.pathname === '/'

	let { children } = $props()

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Random History</title>
</svelte:head>

{#if !isRoot}
	<div class="position-absolute mt-3 ms-3 fs-3">
		<a href="/" rel="external" class="link-primary" aria-label="home">
			<i class="bi bi-house"></i>
		</a>
	</div>
{/if}

<BareLayout>
	{@render children?.()}
</BareLayout>
