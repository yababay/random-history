<script lang="ts">
    export let title: string, back: string | undefined = undefined
</script>

<div class="d-flex justify-content-between w-100 pt-2 ps-2 pe-2">
    <h1>{title}</h1>
    {#if back}
        <a href={back} class="link link-primary">Вернуться</a>
        <input type="hidden" name="back" value={back}>
    {/if}
</div>
