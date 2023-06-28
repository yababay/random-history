<script>
    export let url, converter, fade
    const PAUSE = 2500

    async function showNext(){
      let res = await fetch(url)
      const text = await res.text()
      await fade(false, PAUSE)
      return converter.makeHtml(text)
    }
  </script>
  
  {#await showNext() then html}
    {@html html}
  {/await}
