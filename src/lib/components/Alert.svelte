<script lang="ts">

    type BootstrapLook = 'info' | 'success' | 'danger' | 'warning'

    interface Props {
        look?: BootstrapLook;
        center?: boolean;
        children?: import('svelte').Snippet;
    }

    let { look = 'info', center = true, children }: Props = $props();
</script>

<div class={`alert alert-${look} w-75`} class:text-center={center} role="alert">
    {@render children?.()}
</div>

<style lang="scss">
    .alert {
        max-width: 80ch;
    }
</style>
