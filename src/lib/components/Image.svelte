<script lang="ts">
    import { onMount } from 'svelte'
    import { src, smartSrc, blob, STUB, uploaded } from './store'

    export let link: string = STUB

    $src = link

    let image: HTMLImageElement
    let pictureInput: HTMLInputElement

    onMount(() => {
        smartSrc.subscribe(src => image.src = src)

        document.addEventListener('paste', async (e) => {
            if($smartSrc !== STUB) return
            const clipboardItems = typeof navigator?.clipboard?.read === 'function' ? await navigator.clipboard.read() : (e.clipboardData ? e.clipboardData.files : null);
            if(!clipboardItems) return
            const [ clipboardItem ] = clipboardItems
            if(!(clipboardItem instanceof File)) return
            const { type } = clipboardItem
            if (!type.startsWith('image/')) return
            $src = URL.createObjectURL(clipboardItem)  
            $blob = clipboardItem
            const srcUpdate =await $uploaded 
            if(typeof srcUpdate === 'string') pictureInput.value = srcUpdate
            e.preventDefault();
        })
    })
</script>

{#if $smartSrc.includes('youtube')}
    <iframe width="560" height="340" src={$smartSrc} title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
{:else}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img bind:this={image} class="note-image" />
    <input type="hidden" name="link" value={link} bind:this={pictureInput}>
{/if}

<style>
    .note-image {
        height: auto;
        width: auto;
        max-height: 70vh;
        max-width: 480px; //calc(50vw - 10rem);
        margin: 0 auto;
    }
</style>
