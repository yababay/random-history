<script lang="ts">
    export let id: string, active: boolean
</script>

<div class="tab-pane fade h-100" {id} role="tabpanel" aria-labelledby="home-tab" tabindex="0" class:active={active} class:show={active}>
    <slot>
        <div class="alert alert-secondary w-100 text-center" role="alert">
            Панель {id}.
        </div>
    </slot>
</div>
