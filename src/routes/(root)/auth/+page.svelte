<script lang="ts">

    import { Alert } from '@yababay67/sveltekit-components'
    import { page } from '$app/state'
    import { onMount } from 'svelte';

    const { hash } = page.url

    const getParam = (name: string) => {
        if(!hash) return false
        const arr = hash.slice(1).split('&').filter(el => el.includes(name))
        if(!arr.length) return false
        const [ param ] = arr
        const [ key, token ] = param.split('=')
        return key === name && typeof token === 'string' && token.trim()
    }

    const token = getParam('access_token')
    const age = getParam('expires_in')

    let hidden = true

    onMount(() => hidden = false)
</script>

<div class:d-none={hidden} class="w-100 d-flex justify-content-center">
    {#if !token}
        <Alert look="warning">
            Токен не обнаружен. Пожалуйста, получите его <a href="/login" rel="external" class="link-warning">здесь</a>.
        </Alert>
    {:else}
        <Alert look="success">
                <form method="post" class="w-100 text-center">
                    <input type="hidden" name="token" value={token}>
                    <input type="hidden" name="age" value={age}>
                    Токен получен успешно. Для продолжения нажмите <button type="submit" class="btn btn-sm btn-success">здесь</button>.
                </form>
        </Alert>
    {/if}
</div>
