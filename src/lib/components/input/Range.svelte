<script lang="ts">

    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { idByName } from "./util.js";

    export let
        min: number = 0,
        max: number = 100,
        name: string,
	id: string = idByName(name),
	disabled: boolean = false,
        value: number = 0

    let input: HTMLInputElement
    let badge: string = '' + value

</script>

<div class="d-flex gap-1 justyfy-content-between">
	<input type="range" class="form-range" 
	{min} {max} {id} {name} {value} {disabled} data-checkid={`id-for-${name}`}
	bind:this={input} on:change={function() {badge = this.value}}>
	<span class="badge text-bg-secondary" bind:textContent={badge} contenteditable="true"></span>
</div>

