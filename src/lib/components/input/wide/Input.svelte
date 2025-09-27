<script lang="ts">

    import Wrapper from './Wrapper.svelte'
    import Input from '../Input.svelte'

    export let
        name: string,
        label: string = '',
        value: string = '',
    	placeholder: string = '',
        disabled: boolean = false

</script>

<Wrapper {label} {name}>
    <Input {value} {name} {placeholder} {disabled} slot="input"/>
    <slot />
</Wrapper>

