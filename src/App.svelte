<script>
  import { onMount } from 'svelte'
  import Fact from './Fact.svelte'
  import { Converter } from 'showdown'

  export let fade, intro, pictures

  const converter = new Converter()
  let target 
  let keys = [100069556254, 100151956021].map(el => `content/${el}.md`)

  async function showMore(){
    if(!target) return
    intro.classList.add('d-none')
    pictures.classList.remove('d-none')
    const r = Math.floor(Math.random() * keys.length)
    const url = keys[r]
    const props = {converter, url, fade}
    await fade(true, 2500)
    target.innerHTML = ''
    Reflect.construct(Fact, [{target, props}])
  }

  onMount(async () => {
    if(window.location.hostname !== 'localhost'){
      keys = (await fetch('/bucket-keys').then(res => res.text())).split('\n')
    }
    //showMore()
  })

</script>

<div class="control">
  <button class="btn btn-primary" type="button" on:click={showMore}>Случайный факт</button>
</div>

<div bind:this={target} class="holder"></div>

<style>
  .control {
    width: 80ch;
    text-align: right !important;
    margin: 3rem 1rem 1rem 0;
  }

  .holder {
    width: 80ch;
    margin: 1rem 0;
  }
</style>
