<script lang="ts">
    export let legend: string
</script>

<fieldset>
    <legend>{legend}</legend>
    <section class="d-flex flex-column justify-content-between align-items-center m-0 w-100">
        <slot />
    </section>
</fieldset>

<style lang="scss">
    $space-around: .5rem;
    $margin-top: $space-around * 2;
    $full-height: calc(100% - $space-around - $margin-top);

    fieldset {
        width: 100%;
        max-width: 80ch;
        box-sizing: border-box;
        margin: 0;
        padding: $space-around;
        margin: $space-around;
        border: 1px solid silver;
        border-radius: $space-around;
        margin-top: $margin-top;    
        legend {
            margin: 0;
            background-color: white;
            width: fit-content;
            padding-inline: $space-around;
            margin-top: calc($space-around * -2 - 3px);
            font-size: smaller;
            color: grey;
        }
    }
</style>
