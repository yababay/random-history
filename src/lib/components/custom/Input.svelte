<script lang="ts">
    
    export let
    type: string = 'text',
    value: string = '',
    placeholder: string = '',
    name: string

</script>

{#if type === 'hidden'}
    <input {type} {value} {name}>
{:else}
    <div class="w-100">
        <input  {type} {value} {name} {placeholder} class="form-control">
    </div>
{/if}
