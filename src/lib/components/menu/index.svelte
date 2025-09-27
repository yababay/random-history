<script lang="ts">
    import { page } from '$app/stores'
    import type { MenuItems } from './types.js'
    import iconStub from './icon.svg?raw'
    import { brandStub, itemsStub } from './index.json'

    export let brand = brandStub, items: MenuItems = itemsStub, icon = iconStub

    let { pathname } = $page.url
    if(!pathname.trim()) pathname = '/'

    const getMenu = (): MenuItems => items.map(item => {
        const { title } = item
        const href = Reflect.get(item, 'href') || '#'
        const items = Reflect.get(item, 'items')
        const icon = Reflect.get(item, 'icon')
        return {title, href, items, icon}
    })

    const logo = icon
        .replace('fill="currentColor"', 'fill="white"')
        .replace(/\=\"16\"/g, '="24"')

</script>

<nav class="navbar bg-body-tertiary navbar-expand-lg" data-bs-theme="dark">
<!-- nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark" -->
    <div class="container-fluid">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="navbar-brand d-flex align-items-center gap-2" href="/" data-testid="brand" rel="external">
            {@html logo}
            {brand}
        </a>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-text"
            aria-controls="navbar-text"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbar-text">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                {#each getMenu() as {title, href, items, icon} }
                    {#if items}
                        <li class="nav-item dropdown">   
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a class="nav-link dropdown-toggle" {href} role="button" data-bs-toggle="dropdown" aria-expanded="false" rel="external">
                                {#if icon}
                                    <i class={`bi bi-${icon} d-inline`}></i>
                                {/if}
                                {title}
                            </a>
                            <ul class="dropdown-menu">
                                {#each items as { title, href, icon } }
                                <li>
                                    <a {href} class="dropdown-item" rel="external">
                                        {#if icon}
                                            <i class={`bi bi-${icon} d-inline`}></i>
                                        {/if}
                                        {title}
                                    </a>
                                </li>
                                {/each}
                            </ul>
                        </li>
                    {:else}
                        <li class="nav-item">
                            <a {href} class="nav-link" class:active={href === pathname} rel="external">
                                {#if href && href.includes('github')}
                                    <i class="bi bi-github d-inline"></i>
                                {:else if href && href.includes('https://t.me/')}
                                    <i class="bi bi-telegram d-inline"></i>
                                {:else if href && href === '/'}
                                    <i class="bi bi-house d-inline"></i>
                                {:else if icon}
                                    <i class={`bi bi-${icon} d-inline`}></i>
                                {/if}
                                {title}
                            </a>
                        </li>
                    {/if} 
                {/each}
            </ul>
        </div>
    </div>
</nav>
