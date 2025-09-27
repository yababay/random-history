<script lang="ts">

    import Wrapper from './Wrapper.svelte'
    import Textarea from '../Textarea.svelte'

    export let
        name: string,
        label: string = '',
        value: string = '',
    	placeholder: string = '',
        rows: number = 3,
        maxlength = 50000,
        disabled: boolean = false


</script>

<Wrapper {label} {name}>
    <Textarea {value} {name} {placeholder} {disabled} {rows} {maxlength} slot="input" data-checkid={`id-for-${name}`}/>
    <slot />
</Wrapper>
