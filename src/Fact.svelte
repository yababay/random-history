<script>
    export let url, converter
    
    async function showNext(){
      let res = await fetch(url)
      const text = await res.text()
      return converter.makeHtml(text)
    }
  </script>
  
  {#await showNext() then html}
    {@html html}
  {/await}
