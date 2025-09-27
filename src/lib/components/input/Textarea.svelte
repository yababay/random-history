<script lang="ts">

    import { idByName, descrByName } from "./util.js";

    export let
        name: string,
        value: string = '',
        placeholder: string = '',
        rows: number = 3,
        maxlength = 50000,
		id: string = idByName(name),
		descr: string = descrByName(name),
    	disabled: boolean = false

</script>

<textarea class="form-control w-100 h-100" {rows} {name}  {placeholder} {maxlength} {disabled} {id} aria-describedby={descr}>{value}</textarea>
