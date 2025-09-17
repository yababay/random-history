<script lang="ts">
    export let 
        num: number, 
        prefix: string, 
        postfix: string
    const title = num === 1 ? 'В начало' : `В конец (${num})`
</script>

<li class="page-item">
    <a rel="external"
        {title} 
        class="page-link" 
        href={`${prefix}/${num}${postfix}`} 
        aria-label={'' + num}>
        {#if num===1}
            <span aria-hidden="true">&boxvr;&boxh;</span>
        {:else}
            <span aria-hidden="true">&boxh;&boxvl;</span>
        {/if}
    </a>
</li>
