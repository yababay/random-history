<script lang="ts">
    import { PUBLIC_PICTURE_BASE } from '$env/static/public';
    import { onMount } from 'svelte'

    const STUB = '/stub.png'

    let image: HTMLImageElement
    let idInput: HTMLInputElement
    let linkInput: HTMLInputElement

    onMount(() => {
        document.addEventListener('paste', async (e) => {
            /*if(image.src !== STUB) {
                console.log('already uploaded')
                return
            }*/
            const clipboardItems = typeof navigator?.clipboard?.read === 'function' ? await navigator.clipboard.read() : (e.clipboardData ? e.clipboardData.files : null);
            if(!clipboardItems) return
            const [ clipboardItem ] = clipboardItems
            if(!(clipboardItem instanceof File)) return
            const { type } = clipboardItem
            if (!type.startsWith('image/')) return
            if (!window.FileReader) return
            const reader = new FileReader()
            const id = await new Promise((yep, nop) => {
                reader.onload = function() {
                    var dataUrl = reader.result;
                    if (dataUrl == null) return nop('no data url')
                    yep(dataUrl.toString()); // <= here
                };
                reader.onerror = function() {
                    nop('Incorrect blob or file object.');
                };
                reader.readAsDataURL(clipboardItem);
            })
            .then(body => {
                if(typeof body !== 'string') return Promise.reject('blob must be string')
                return fetch('/api/upload', {method: 'post', headers: {'Content-Type': 'text/plain'}, body})
            })
            .then(resp => resp?.text())
            .then(key  => {
                if(typeof key !== 'string') return Promise.reject('uploader response is not a string')
                const url = `${PUBLIC_PICTURE_BASE}/${key}`    
                image.src = url
                linkInput.value = url
                const arr = /.*\/(\d+).[a-z]+$/.exec(key) || []
                const [ _, id ] = arr
                if(typeof id !== 'string') return Promise.reject(`id ${id} is not a string`)
                return id
            })
            .catch(err => console.log(err))
            idInput.value = id || ''
            //image.src = URL.createObjectURL(clipboardItem)  
        })
    })
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<img class="note-image" src={STUB} bind:this={image}/>
<input type="hidden" name="link"   bind:this={linkInput}>
<input name="id" type="hidden"     bind:this={idInput}/>

<style>
    .note-image {
        height: auto;
        width: auto;
        max-height: 70vh;
        max-width: 480px;
        margin: 0 auto;
    }
</style>
