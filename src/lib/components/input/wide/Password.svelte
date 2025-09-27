<script lang="ts">

    import Wrapper from './Wrapper.svelte'
    import Password from '../Password.svelte'

    export let
        name: string,
        label: string = '',
        value: string = '',
        placeholder: string = 'пароль пользователя',
        disabled: boolean = false


</script>

<Wrapper {label} {name}>
    <Password {value} {name} {placeholder} {disabled} slot="input"/>
    <slot />
</Wrapper>
