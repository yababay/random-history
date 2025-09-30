<script lang="ts">

    type BootstrapLook = 'info' | 'success' | 'danger' | 'warning'

    export let look: BootstrapLook = 'info', center: boolean = true
</script>

<div class={`alert alert-${look} w-75`} class:text-center={center} role="alert">
    <slot />
</div>

<style lang="scss">
    .alert {
        max-width: 80ch;
    }
</style>
