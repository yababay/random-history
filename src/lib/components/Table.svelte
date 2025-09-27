<script lang="ts">
    export let columns: string[] | string
    if(typeof columns === 'string') columns = columns.split(/[\ \,]+/)
</script>

<table class="table table-striped w-100">
    <thead>
        <tr>
            {#each columns as title}
                <th class="text-center">{title || ''}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        <slot />
    </tbody>
</table>

<style lang="scss">
    table {
        max-width: 100ch;
    }
</style>