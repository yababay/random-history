<script lang="ts">
    export let
        prefix: string = '',
        postfix: string = '',
        num: number,
        active = false
</script>

<li class="page-item">
    <a rel="external" 
        class="page-link" 
        class:active={active} 
        href={`${prefix}/${num}${postfix}`} 
        aria-label={'' + num}>
        {num}
    </a>
</li>
