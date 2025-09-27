<script lang="ts">
    import showdown from 'showdown'

    export let readme: string
    
    const converter = new showdown.Converter()
    const html = converter.makeHtml(readme)

</script>

<article>
    {@html html}
</article>

<style lang="scss">
    article {
        max-width: 80ch;
    }
</style>
