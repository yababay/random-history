<script>

    import { page } from '$app/state'
    import Editor from '$lib/components/custom/Editor.svelte'
    import Publisher from '$lib/components/custom/Publisher.svelte';
    import { COLLECTIONS, getIcon, getTitle } from "$lib/types";

	const isLocal = page.url.hostname === 'localhost'

</script>

<h5 class="mb-3 mt-3">Выберите коллекцию для редактирования</h5>

<nav aria-label="Collections to edit">
    <ol class="breadcrumb">
        {#each COLLECTIONS as coll}
            <li class="breadcrumb-item"><a href={`/collection/${coll}`} rel="external">{getTitle(coll)}</a></li>
        {/each}
    </ol>
</nav>

<h5 class="mb-3 mt-3">Или создайте новый материал:</h5>

{#if isLocal}
    <Editor rows={15} />
{:else}
    <Publisher />
{/if}
