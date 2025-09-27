<script lang="ts">

    import { idByName, descrByName } from "./util.js";

    export let
        name: string,
        value: string = '',
        placeholder: string = '',
		id: string = idByName(name),
		descr: string = descrByName(name),
	    disabled: boolean = false

</script>

<input
	type="text"
	class="form-control"
	{name} {value} {placeholder} {disabled} {id}
	aria-label={placeholder}
	aria-describedby={descr}
>

