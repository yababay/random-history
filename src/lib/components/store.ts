import { writable, derived } from "svelte/store"
import { PUBLIC_PICTURE_BASE } from '$env/static/public'

export const STUB = '/stub.png'

export const src = writable<string | null>(null)

export const smartSrc = derived(src, $src => {
    if(!$src) return STUB
    console.log($src)
    if($src.includes('media/')) return `${PUBLIC_PICTURE_BASE}/${$src}`
    if($src.includes('youtube')){
        let arr: Array<string> | null = /.*v=([^\=\&]+)/.exec($src)
        return arr ? `https://www.youtube.com/embed/${arr[1]}` : STUB
    }
    return $src
})

export const blob = writable<File | null>(null)

export const uploaded = derived(blob, $blob => 
    $blob ? new Promise((yep, nop) => {
        if (!window.FileReader) return nop('There is no filereader')
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl = reader.result;
            if (dataUrl == null) return nop('no data url')
            yep(dataUrl.toString()); // <= here
        };
        reader.onerror = function() {
            nop('Incorrect blob or file object.');
        };
        reader.readAsDataURL($blob);
    })
    .then(body => {
        if(typeof body !== 'string') return Promise.resolve(null)
        return fetch('/api/upload', {method: 'post', headers: {'Content-Type': 'text/plain'}, body})
    })
    .then(resp => resp?.text())
    :
    Promise.resolve(null)
)
