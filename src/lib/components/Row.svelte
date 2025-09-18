<script lang="ts">

    import type { RandomHistory } from '$lib/types'
    import showdown from 'showdown'

    export let record: RandomHistory
    export let prefix: string

    const converter = new showdown.Converter()
    const { message, author, link, id, tags } = record
    const html = converter.makeHtml(message.replace(/\s+/gm, ' ')).trim().replace(/^<p>/, '').replace(/<\/p>$/, '')
    const href = `${prefix}/${id}`
    
</script>

<tr class="tr-height">
    {#if link}
        <td align="center"><img src={link} alt="" class="image-preview"></td>
    {/if}
    <td class="td-caption">{@html html}</td>
    {#if author}
        <td class="td-author">{author}</td>
    {/if}
    {#if tags}
        <td class="td-tags">{tags || ''}</td>
    {/if}
    <td align="center">
        <form method="post">
            <input type="hidden" value={id} name="id">
            <div class="btn-group" role="group" aria-label="actions">
                <a {href} rel="external" type="button" class="btn btn-sm btn-outline-secondary" aria-label="edit" title="Править"><i class="bi bi-pen"></i></a>
                <button type="submit" class="btn btn-sm btn-outline-secondary" aria-label="delete" title="Удалить"><i class="bi bi-trash"></i></button>
            </div>
        </form>
    </td>
</tr>

<style>
    .tr-height {
        height: 32px;
    }

    .td-caption, .td-tags {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;        
        max-width: 55ch;
    }

    .td-author {
        max-width: 25ch;
        color: gray;
    }

    .td-tags {
        font-size: small;
        max-width: 25ch;
        color: gray;
    }

    .image-preview {
        max-width: 32px;
        max-height: 32px;
    }
</style>
