<script lang="ts">

    import { idByName, descrByName } from "../util.js";


    export let
        name: string,
        label: string = ''

    const id = idByName(name)
    const descr = descrByName(name)

</script>

<div class="w-100">
    <label for={id} class="form-label" class:d-none={!(label && label.trim())}>{label}</label>
    <slot name="input" />
    <div class="form-text" id={descr}>
    	<slot />
    </div>
</div>
