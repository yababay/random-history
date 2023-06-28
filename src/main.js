import './layout.css'
import './header.css'
import './main.css'
import './footer.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import App from './App.svelte'

const target = document.querySelector('article')
const app = new App({ target })

export default app
