<script>
  import { onMount } from 'svelte'
  import Fact from './Fact.svelte'
  import Invite from './Invite.svelte'
  import { Converter } from 'showdown'

  export let fade, intro, pictures
  let counter = 10 + Math.floor(Math.random() * 5)

  const converter = new Converter()
  let target, control 
  let keys = [100069556254, 100151956021].map(el => `content/${el}.md`)

  async function showMore(hide = true){
    if(!target) return
    if(hide) intro.classList.add('d-none')
    pictures.classList.remove('d-none')
    const r = Math.floor(Math.random() * keys.length)
    const url = keys[r]
    await fade(true, 2500)
    target.innerHTML = ''
    if(counter-- > 0) Reflect.construct(Fact, [{target, props: {converter, url, fade}}])
    else {
      control.classList.add('d-none')
      Reflect.construct(Invite, [{target, props: {fade}}])
    }
  }

  onMount(async () => {
    if(window.location.hostname !== 'localhost'){
      keys = (await fetch('/bucket-keys').then(res => res.text())).split('\n')
    }
    await showMore(false)
  })

</script>

<div class="control"  bind:this={control}>
  <button class="btn btn-primary" type="button" on:click={async e => await showMore()}>Случайный факт</button>
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
