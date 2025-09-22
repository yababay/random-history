<script lang="ts">

    import Slots from '$lib/components/Slots.svelte'
    import Image from '$lib/components/Image.svelte'
    import { COLLECTIONS, getTitle, type Collection, type RandomHistory } from '$lib/types'
    import { Fieldset, Submit, Textarea, WideInput } from '@yababay67/sveltekit-components'
    import Tags from '$lib/components/tags/index.svelte'

    export let record: RandomHistory = { message: '', link: '/stub.png', tags: new Array<string>()}
    export let collection: Collection = 'drafts'
    export let rows = 20
    import { STUB } from './store'

    let { id, message, link, tags, author } = record
    if(!link) link = STUB
    const legend = !message ? 'Новое сообщение' : `Из коллекции «${getTitle(collection as Collection)}»`
    
    if(typeof tags === 'string') tags = tags.split(' ').map(tag => tag.replace('#', ''))

</script>

{#if collection === 'quotations'}
    <form method="post" class="w-100 d-flex justify-content-center">
        <input name="id" type="hidden" value={id}/>
        <input name="collection" type="hidden" value={collection}/>
        <Fieldset {legend} >
            <div class="w-100 d-flex align-items-start mt-3 ps-3 pe-3">
                <label for="message" class="w-25">Сообщение</label>
                <Textarea value={message} {rows} name="message" />
            </div>
            <div class="w-100 d-flex align-items-end mt-3 mb-3 ps-3 pe-3">
                <label for="author" class="w-25 mb-2">Автор</label>
                <WideInput name="author" value={author} /> 
            </div>
            <div class="w-100 d-flex align-items-start mt-3 mb-3 ps-3 pe-3">
                <Submit></Submit>
            </div>
        </Fieldset>
    </form>
{:else}
    <Slots>
        <div slot="left" class="w-100 h-100 d-flex flex-direction-column justify-content-center align-items-center">
            {#if id}
                <img src={link} alt="preview" class="w-100 p-3">
                <input name="id" type="hidden" value={id}/>
            {:else}
                <Image {link} /> 
            {/if}
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
                    <label for="message" class="w-25">Сообщение</label>
                    <Textarea value={message} {rows} name="message" />
                </div>
                {#if !message}
                    <div class="w-100 d-flex align-items-end mt-3 mb-3 ps-3 pe-3">
                        <label for="author" class="w-25 mb-2">Автор</label>
                        <WideInput name="author" value={author} /> 
                    </div>
                {/if}
                <div class="w-100 d-flex align-items-end mt-3 mb-3 ps-3 pe-3">
                    <label for="tags" class="w-25 mb-2">Тэги</label>
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
{/if}
