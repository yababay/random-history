<script lang="ts">
	import favicon from '$lib/assets/dice-12.svg'
	import { BareLayout } from '@yababay67/sveltekit-components'

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Random History</title>
</svelte:head>

<BareLayout>
	{@render children?.()}
</BareLayout>
