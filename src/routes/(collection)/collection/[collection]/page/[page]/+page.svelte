<script lang="ts">

    import Header from '$lib/components/Header.svelte'
    import Pagination from '$lib/components/pagination/index.svelte'
    import { Table } from '@yababay67/sveltekit-components'
    import { type Collection, getTitle, type RandomHistory } from '$lib/types'
    import Row from '$lib/components/Row.svelte';

    export let data: { collection: Collection, records: RandomHistory[], prefix: string, count: number, current: number }

    const { collection, records, prefix, count, current } = data
    const brand = getTitle(collection)
    const title = `Коллекция «${brand}»`
</script>

<section>
    <Header {title} />
    <Table columns="🖼️ Сообщение Тэги Действ.">
        {#each records as record}
            <Row {record} {prefix} />
        {/each}
    </Table>
    <Pagination {count} {current} prefix={`/collection/${collection}/page`}/>
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
