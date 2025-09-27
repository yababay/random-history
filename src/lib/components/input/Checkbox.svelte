<script lang="ts">

    import { idByName, descrByName } from "./util.js";

    export let
    	label: string = '',
        name: string,
        value: string = 'on',
	checked: boolean = false,
        placeholder: string = '',
	id: string = idByName(name),
	descr: string = descrByName(name),
	disabled: boolean = false

</script>

<div class="form-check">
    {#if checked}
        <input class="form-check-input" type="checkbox" data-checkid={id} {id} {name} {value} {disabled} checked>
    {:else}
        <input class="form-check-input" type="checkbox" data-checkid={id} {id} {name} {value} {disabled}>
    {/if}
    {#if label || placeholder}
        <label class="form-check-label" for={id} id={descr}>
	    {label || placeholder}
	</label>
    {/if}
</div>
    
