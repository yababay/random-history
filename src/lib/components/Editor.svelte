<script lang="ts">

    import Slots from '../Slots.svelte'
    import Fieldset from '../Fieldset.svelte'
    import Field from '../Field.svelte'
    import type { MessageAttributes } from '$lib/types'
    import { collections, getTitle } from '$lib/types'
    import { PUBLIC_POSTGRES_COLLECTION } from '$env/static/public'

    export let values: MessageAttributes

    let { link, back, message, notes, tags, id } = values
    if(!(link && /.*\.(jpg|jpeg|png)$/.test(link))) link = '/stub.png'

</script>

<Slots>
    <div slot="left" class="w-100 h-100 d-flex flex-direction-column justify-content-center align-items-center">
        <img src={link} alt="preview" class="w-100 p-3">
        <input name="link" type="hidden" value={link}/>
        <input name="id" type="hidden" value={id}/>
    </div>
    <Fieldset slot="right" rows={10} {message} {notes} {tags} {back} >
        <Field label="Коллекция:">
            <div class="w-100">
                <select class="form-select" name="collection">
                    {#each collections as value}
                        <option {value} selected={value === PUBLIC_POSTGRES_COLLECTION}>{getTitle(value)}</option>
                    {/each}
                </select>
            </div>
        </Field>
    </Fieldset>
</Slots>
