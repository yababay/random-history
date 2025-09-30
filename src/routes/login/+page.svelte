<script lang="ts">

	import BareLayout from '$lib/components/layout/Bare.svelte'

</script>

<BareLayout title="Вход в систему">
    <iframe src="/api/login" title="yandex authorization"></iframe>
</BareLayout>

<style lang="scss">
    iframe {
        max-width: 640px;
        width: 100%;
        height: 72px;
        padding: 0;
        border: 0;
        margin: 0;
        margin-inline: 1rem;
    }
</style>
