<script>
    import { COLLECTIONS, getIcon, getTitle } from "$lib/types";

</script>
<h5 class="mb-5">Выберите коллекцию для редактирования</h5>


<nav aria-label="Collections to edit">
    <ol class="breadcrumb">
        {#each COLLECTIONS as coll}
            <li class="breadcrumb-item"><a href={`/collection/${coll}`} rel="external">{getTitle(coll)}</a></li>
        {/each}
    </ol>
  </nav>
  
  