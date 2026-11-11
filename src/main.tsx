import $ from 'jquery'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

window.$ = window.jQuery = $

function runEnterAnimations() {
  $('.paz-screen-enter').each(function animate(i, el) {
    window.setTimeout(() => {
      $(el).addClass('is-visible')
    }, 80 * i)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App onRoutePaint={runEnterAnimations} />
    </BrowserRouter>
  </StrictMode>,
)

declare global {
  interface Window {
    $: typeof $
    jQuery: typeof $
  }
}
