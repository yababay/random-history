<script lang="ts">

    export let
    name: string = 'message',
    placeholder: string = 'введите сообщение, можно использовать markdown',
    value: string = '',
    caption: boolean = true,
    rows: number = 3

    const maxlength = caption ? 1024 : 4096

</script>

<textarea class="form-control" {rows} {name} {value} {placeholder} {maxlength} class:full-height={!caption}></textarea>

<style lang="scss">
    .full-height {
        height: calc(100vh - 4.5rem)
    }
</style>
