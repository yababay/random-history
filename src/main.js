import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './layout.css'
import './header.css'
import './main.css'
import './footer.css'
import App from './App.svelte'

const pictures = document.querySelector('article #pictures')
const intro  = document.querySelector('article #intro')
const target = pictures

document.querySelector('[href="#intro"]').addEventListener('click', e => {
    e.preventDefault()
    intro.classList.remove('d-none')
})

const fade = async (yes, pause = 4500) => {
    target.classList.remove('unfaded')
    target.classList.remove('faded')
    target.classList.add(yes ? 'faded' : 'unfaded')
    await new Promise(resolve => setTimeout(resolve, pause))
};

const props = {fade, intro, pictures}
const app = new App({ target, props })

export default app
