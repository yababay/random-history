<script lang="ts">

    import Slots from '$lib/components/Slots.svelte'
    import { COLLECTIONS, getTitle, type Collection, type RandomHistory } from '$lib/types'
    import { Fieldset, Input, Submit, Textarea } from '@yababay67/sveltekit-components'
    import Tags from '$lib/components/tags/index.svelte'

    export let data: { record: RandomHistory, legend: string, collection: Collection }

    let { id, message, link, tags, author } = data.record
    let { legend, collection } = data

    if(typeof tags === 'string') tags = tags.split(' ').map(tag => tag.replace('#', ''))
</script>


<Slots>
    <div slot="left" class="w-100 h-100 d-flex flex-direction-column justify-content-center align-items-center">
        <img src={link} alt="preview" class="w-100 p-3">
        <input name="link" type="hidden" value={link}/>
        <input name="id" type="hidden" value={id}/>
    </div>
    <div slot="right" class="w-100 h-100 d-flex flex-direction-column justify-content-center align-items-center">
        <Fieldset {legend} >
            <div class="w-100 d-flex align-items-center mt-3 ps-3 pe-3">
                <label for="collections" class="w-25">В коллекцию</label>
                <select class="form-select w-50" name="collection" id="collections">
                    {#each COLLECTIONS as value}
                        <option {value} selected={value === collection}>{getTitle(value)}</option>
                    {/each}
                </select>
            </div> 
            <div class="w-100 d-flex align-items-start mt-3 ps-3 pe-3">
                <label for="collections" class="w-25">Сообщение</label>
                <Textarea value={message} rows={20} name="message" />
            </div>
            <div class="w-100 d-flex align-items-end mt-3 mb-3 ps-3 pe-3">
                <label for="collections" class="w-25 mb-2">Тэги</label>
                <Tags {tags} url="/api/tags" /> 
            </div>
            <div class="w-100 d-flex align-items-start mt-3 mb-3 ps-3 pe-3">
                <Submit>
                    <div class="form-check d-inline-block me-5" slot="options">
                        <input class="form-check-input" type="checkbox" id="vk" name="vk" value="vk">
                        <label class="form-check-label" for="vk">в группу ВК</label>
                    </div>                    
                </Submit>
            </div>
        </Fieldset>
    </div>
</Slots>
