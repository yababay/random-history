const aside = document.querySelector('aside')

const HIDDEN_ASIDE = 'd-none'

const toggleAside = (hide = false) => {
    if(!aside) return
    console.log('aside', hide)
    if(hide) aside.classList.add(HIDDEN_ASIDE)
    else aside.classList.remove(HIDDEN_ASIDE)
}

const showAside = document.querySelector('#show-aside')
const hideAside = document.querySelector('#hide-aside')

if(showAside) showAside.addEventListener('click', () => toggleAside())
if(hideAside) hideAside.addEventListener('click', () => toggleAside(true))