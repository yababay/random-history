<script>
    import HeaderLink from "$lib/components/HeaderLink.svelte";

</script>
<section>

    <header>
        <ul class="list-group ms-3 fs-5">
            <HeaderLink title="подписывайтесь" icon="telegram" href="https://t.me/random_historical_pictures" />
            <HeaderLink title="вступайте в ВК" icon="person-check" href="https://vk.com/random_historical_pictures" />
        </ul>
        <img src="random-history-poster.png" alt="Милота!">
    </header>

    <div class="position-absolute mt-3 ms-3">
        <h3 class="text-light">Сообщество ¨Random History¨</h3>
        <p class="text-light mt-2 mb-5">Фонтан исторической милоты от Адама до <del>Потсдама</del> Саддама.</p>
    </div>

    <div class="slides-wrapper">
        <div id="slides" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                <img src="/stub.png" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                <img src="/stub.png" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                <img src="/stub.png" class="d-block w-100" alt="...">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#slides" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#slides" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div class="alert alert-dark" role="alert">
            <h5>Посмотрите слайд-шоу из нашей коллекции</h5>
            <p>lorem ipsem</p>
            <p>Присоединяйтесь</p>
        </div>
    </div>
</section>