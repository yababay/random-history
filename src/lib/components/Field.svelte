<script lang="ts">

    export let 
    id: string = `${Math.random()}`,
    label: string = '', 
    width: number = 3,
    top: boolean = false

</script>

<div class="row w-100 mb-3">
    <div class={`col-${width} d-flex justify-content-end pe-1`} class:align-items-center={!top}>
        <label for={id} class:mt-2={top}>
            <b>{label}</b>
        </label>
    </div>
    <div class={`col-${12 - width} d-flex align-items-center justify-content-between pe-0`}>
        <slot />
    </div>
</div>
