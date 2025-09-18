<script lang="ts">

    export let icon: string
    export let title: string
    export let href: string

</script>

<li class="list-group-item">
    <a {href} rel="external" class="link-light">
        <i class={`bi bi-${icon} me-3`}></i>
        {title}
    </a>
</li>
