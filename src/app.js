import { auth } from './utils/firebase/database'
import renderAuth from './views/auth_view'
import renderSwipe from './views/swipe_view'
import renderGallery from './views/gallery_view'
import renderAbout from './views/about_view'
import renderChat from './views/chat_view'
import error404 from './views/error_view'
import { parseRequestUrl } from './utils/parser'

const routes = {
  '/': renderSwipe,
  '/auth': renderAuth,
  '/gallery': renderGallery,
  '/about': renderAbout,
  '/chat/:id': renderChat,
}

const router = async () => {
  const request = parseRequestUrl()
  const parseUrl =
  (request.resource ? `/${request.resource}` : '/') +
  (request.id ? '/:id' : '') +
  (request.verb ? `/${request.verb}` : '')

  const screen = routes[parseUrl] ? routes[parseUrl] : error404
  const app = document.getElementById('app')
  app.innerHTML = await screen.render()
}

window.addEventListener('load', router)

auth.onAuthStateChanged((user) => {
  const redirectPath = user ? window.location.hash : '/#/auth'
  if (window.location.hash !== redirectPath) {
    window.location.href = redirectPath
  }
})

window.addEventListener('hashchange', router)