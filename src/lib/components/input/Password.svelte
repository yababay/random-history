<script lang="ts">

	import { idByName, descrByName } from "./util.js";

    export let
        name: string,
        value: string = '',
        placeholder: string = 'пароль пользователя',
		id: string = idByName(name),
		descr: string = descrByName(name),
	    disabled: boolean = false

</script>

<input
	type="password"
	class="form-control"
	{name} {value} {placeholder} {disabled} {id}
	aria-label={placeholder}
	aria-describedby={descr}
>

