<script>
    export let tagsListener, text
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span class="badge text-bg-primary tag-badge" on:click={e => tagsListener(text, true)}>{text}</span>
<span>&nbsp;</span>

<style>
    .tag-badge {
        cursor: pointer;
    }
</style>
