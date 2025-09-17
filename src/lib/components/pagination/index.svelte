<script lang="ts">
  import Item from './Item.svelte'
  import { PUBLIC_ROWS_PER_PAGE, PUBLIC_PAGINATION_HALF } from '$env/static/public'
    import Limit from './Limit.svelte';

  const perPage = +PUBLIC_ROWS_PER_PAGE
  const paginationHalf = +PUBLIC_PAGINATION_HALF
  const doubleHalf = paginationHalf * 2 + 1

  export let count: number, current: number = 1,
  prefix: string = '',
  postfix: string = ''
  
  const noDecorations = count <= doubleHalf
  let pages = new Array<number>(noDecorations ? count : doubleHalf)
  let min = current - paginationHalf

  while(min < 1) min++
  
  for(let i = 0; i < doubleHalf; i++){
    pages[i] = i + min
  }

  while(pages[pages.length - 1] > count) pages.pop()

  while(pages.length < doubleHalf){
    const page = pages[0] - 1
    if(page === 0) break
    pages = [page, ...pages]
  }

  let leftLimit = !noDecorations && pages[0] !== 1
  let rightLimit = !noDecorations && pages[pages.length - 1] !== count

</script>

{#if count > 1}

<nav aria-label="pagination">
  <ul class="pagination">
    {#if leftLimit}
      <Limit num={1} {prefix} {postfix}/>
    {/if}
    {#each pages as num }
      <Item {num} active={num === current} {prefix} {postfix}/>
    {/each}
    {#if rightLimit}
      <Limit num={count} {prefix} {postfix}/>
    {/if}
    </ul>
</nav>

{:else}
<p>&nbsp;</p>
{/if}
