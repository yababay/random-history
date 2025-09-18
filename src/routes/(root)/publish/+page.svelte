<script lang="ts">

    import { COLLECTIONS, getTitle } from "$lib/types"
    import { Fieldset } from "@yababay67/sveltekit-components"

    const legend = 'Из коллекции:'

</script>

<Fieldset {legend}>
    <form method="post" class="w-100">
        <div class="row w-100 mt-3 mb-3">
            <div class="col-4 d-flex justify-content-center">
                <div class="btn-group-vertical" role="group" aria-label="Publish from collection">
                    {#each COLLECTIONS.filter(el => el !== 'drafts') as coll }
                        <input type="radio" class="btn-check" name="collection" id={coll} autocomplete="off" value={coll} checked={ coll === 'cognitive' }>
                        <label class="btn btn-sm btn-outline-primary" for={coll}>{getTitle(coll)}</label>
                    {/each}
                </div>
            </div>
            <div class="col-8 d-flex justify-content-end align-items-center pe-3">
                <div class="form-check form-switch me-3">
                    <input class="form-check-input" type="checkbox" role="switch" id="admin" name="admin">
                    <label class="form-check-label" for="admin">в адм. канал</label>
                </div>
                <div class="form-check form-switch me-5">
                    <input class="form-check-input" type="checkbox" role="switch" id="vk" name="vk">
                    <label class="form-check-label" for="vk">в группу ВК</label>
                </div>
                <button class="btn btn-primary" type="submit">Публиковать</button>
            </div>
        </div>
    </form>
</Fieldset>
