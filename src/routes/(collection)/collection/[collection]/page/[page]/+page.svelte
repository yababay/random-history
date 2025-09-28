<script lang="ts">

    import Header from '$lib/components/custom/Header.svelte'
    import Pagination from '$lib/components/custom/pagination/index.svelte'
    import Table from '$lib/components/Table.svelte'
    import { type Collection, getTitle, type RandomHistoryRecord } from '$lib/types'
    import Row from '$lib/components/custom/Row.svelte'
    
    export let data: { collection: Collection, records: RandomHistoryRecord[], prefix: string, count: number, current: number }
    
    const { collection, records, prefix, count, current } = data
    const brand = getTitle(collection)
    const title = `Коллекция «${brand}»`

</script>

<section>

    <Header {title} />

    {#if collection === 'quotations'}
    <Table columns="Цитата Автор Действ.">
        {#each records as record}
            <Row {record} {prefix} />
        {/each}
        </Table>
    {:else}
        <Table columns="👁️‍🗨️ Сообщение Тэги Действ.">
            {#each records as record}
                <Row {record} {prefix} />
            {/each}
        </Table>
    {/if}
            
    <Pagination {count} {current} prefix={`/collection/${collection}/page`} />

</section>

<style lang="scss">
    section {
        height: 100%;
        max-width: 80ch;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }
</style>
