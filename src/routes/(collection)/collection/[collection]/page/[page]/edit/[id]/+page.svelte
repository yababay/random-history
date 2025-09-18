<script lang="ts">

    import Editor from '$lib/components/Editor.svelte'
    import { type Collection, type RandomHistory } from '$lib/types'
    
    export let data: { record: RandomHistory, collection: Collection }

    const { collection, record } = data

</script>

<Editor {collection} {record} />
