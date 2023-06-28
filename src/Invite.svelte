<script>
    import { onMount } from "svelte"
    
    export let fade

    onMount(async () => {
        await fade(false, 2500)
    })
</script>
<div class="alert alert-success alert-dismissible" role="alert">
    <div>
        Спасибо за посещение! 
        К сожалению, количество просмотров ограничено.
        Попробуйте воспользоваться  
        <a href="https://t.me/random_historical_pictures" target="_blank" class="link-primary" title="Telegram">Телеграм-ботом Random History</a>,
        в котором представлены материалы из этой же коллекции.
    </div>
    <button on:click={e => window.location.reload()} type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Перезагрузить окно"></button>
</div>
