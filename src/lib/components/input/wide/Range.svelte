<script lang="ts">

    import Wrapper from './Wrapper.svelte'
    import Range from '../Range.svelte'

    export let
        name: string,
        label: string = '',
        value: number = 0,
        min: number = 0,
        max: number = 100,
	disabled: boolean = false


</script>

<Wrapper {label} {name}>
    <Range {value} {min} {max} {name} {disabled} slot="input"/>
    <slot />
</Wrapper>
