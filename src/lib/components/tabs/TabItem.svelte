<script lang="ts">
    import type { Booleanish } from "svelte/elements";
    export let target: string, label: string, selected: Booleanish = 'false', active: boolean
</script>

<li class="nav-item" role="presentation">
    <button class="nav-link" data-bs-toggle="tab" class:active={active}
    data-bs-target={`#${target}`} type="button" role="tab"
    aria-controls={target} aria-selected={selected}>{label}</button>
</li>
