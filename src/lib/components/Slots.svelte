<script lang="ts">
    export let left: number = 5
    const right = 12 - left
</script>

<form method="post">
    <div id="editor-left">
        <slot name="left" />
    </div>
    <div  id="editor-right">
        <slot name="right" />
    </div>
</form>

<style lang="scss">
    form, #editor-left, #editor-right {
        box-sizing: border-box;
        margin:  0 !important;
        padding: 0 !important;
        border:  0 !important;
    }

    form {
        display: grid;
        grid-template-columns: 480px auto;
        grid-template-rows: 100vh;    
    }

    #editor-right {
        min-width: 800px;
    }
</style>
