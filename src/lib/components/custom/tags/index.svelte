<script lang="ts">
    import { onMount } from 'svelte'
    import { writable, derived } from 'svelte/store'
    import Field from '../Field.svelte'
    //import TagBadge from './TagBadge.svelte'
    import Autocomplete from './autocomplete.js'

    export let 
    tags: string[] = [],
    url: string = '/tags.json',
    separator: string = ' '
    //width: number = 1,
    
    const reactiveTags = writable(Array.isArray(tags) && tags.length && tags.sort() || [])
    const badgesHtml = derived(reactiveTags, (tags) => tags.map(tag => `<span style="cursor: pointer" class="badge text-bg-primary tag-badge">${tag}</span>`))

    let badges: HTMLParagraphElement, input: HTMLInputElement, hidden: HTMLInputElement
    
    const tagsListener = (tag: string, del: boolean = false) => {
        const current = $reactiveTags
        const sorted = [...new Set([...current, tag])].sort()
        const update = del ? current.filter(t => t !== tag) : sorted
        $reactiveTags = update
    }

    const updateTags = () =>  {
        tagsListener(input.value.trim())
        input.value = ''
    }

    function tagUp(e: KeyboardEvent){
        if(e.code !== 'ArrowUp') return
        updateTags()
    }

    onMount(() => {
        const settings = {
            onSelectItem: () => {
                updateTags()
            }
        }
        Reflect.construct(Autocomplete, [input, settings])
        reactiveTags.subscribe(tags => {
            hidden.value = tags.join(separator)
        })

        badgesHtml.subscribe(tags => {
            badges.innerHTML = tags.join('&nbsp;')
            for(const badge of badges.childNodes){
                if(!(badge instanceof HTMLSpanElement)) continue
                badge.addEventListener('click', () => {
                    const update = $reactiveTags.filter(tag => tag !== badge.textContent)
                    $reactiveTags = update
                })
            }
        })
    })

</script>

<div class="w-100 d-flex flex-column justify-content-end wrapper">
    <p bind:this={badges} class="text-end w-100"></p>
    <input name="tags" type="hidden" bind:this={hidden}>

    <!--Field id="tags" label=""-->
        <div class="w-100">
    <input
        data-server={url}
        type="text"
        class="form-control w-100"
        placeholder="выберите или введите тэги"
        bind:this={input}
        on:keydown={tagUp}
    />
        </div>
    <!-- /Field -->
</div>

<style lang="scss">
    .wrapper {
        height: 80px;
    }
</style>