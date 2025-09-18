<script>

    import Editor from '$lib/components/Editor.svelte'
    import { COLLECTIONS, getIcon, getTitle } from "$lib/types";

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

<Editor rows={15} />
