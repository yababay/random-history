<script lang="ts">
    export let label: string = 'Сохранить', back: string = '', formaction: string = ''
</script>

<div class="text-end w-100 mt-2">
    <slot name="options">
        {#if back}
            <a class="btn btn-primary me-2" href={back} rel="external">Вернуться</a>
        {/if}
    </slot>
    <button class="btn btn-primary" type="submit" {formaction}>
        <slot name="label">
            {label}
        </slot>
    </button>
</div>
