<script lang="ts">

    import Editor from '$lib/components/custom/Editor.svelte'
    import { type Collection, type RandomHistoryRecord } from '$lib/types'
    
    export let data: { record: RandomHistoryRecord, collection: Collection }

    const { collection, record } = data

</script>

<Editor {collection} {record} />
