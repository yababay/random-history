<script lang="ts">
    import TabItem from "./TabItem.svelte";
    import TabPane from "./TabPane.svelte";

    export let 
        tabs: string[][], 
        active: string = tabs[0][0]

</script>

<div class="tab-content w-100">

    <ul class="nav nav-tabs" role="tablist">
        {#each tabs as [id, label], i}
            <TabItem target={`${id}-tab-pane`} {label} active={id === active}/>
        {/each}
    </ul>

    {#each tabs as [id], i}
        <TabPane id={`${id}-tab-pane`} active={id === active}>
            {#if i === 0}
                <slot name="tab-1" />
            {:else if i === 1}
                <slot name="tab-2" />
            {:else if i === 2}
                <slot name="tab-3" />
            {:else if i === 3}
                <slot name="tab-4" />
            {:else if i === 4}
                <slot name="tab-5" />
            {:else if i === 5}
                <slot name="tab-6" />
            {:else if i === 6}
                <slot name="tab-7" />
            {:else if i === 7}
                <slot name="tab-8" />
            {:else if i === 8}
                <slot name="tab-9" />
            {/if}
        </TabPane>
    {/each}

</div>
