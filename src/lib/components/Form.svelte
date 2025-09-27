<script lang="ts">
    import Fieldset from './Fieldset.svelte'
    export let legend: string
</script>

<Fieldset {legend}>
    <form method="post" class="w-100">
        <slot />
    </form>
</Fieldset>

<style lang="scss">
    form {
        max-width: 80ch;
        padding-inline: 1.5rem;
        padding-block: .7rem;
    }
</style>
