import { auth } from './utils/firebase/database'
import renderAuth from './views/auth_view'
import renderSwipe from './views/swipe_view'
import renderGallery from './views/gallery_view'
import renderAbout from './views/about_view'
import error404 from './views/error_view'

const routes = {
  '/': renderSwipe,
  '/auth': renderAuth,
  '/gallery': renderGallery,
  '/about': renderAbout,
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

const parseRequestUrl = () => {
  const address = document.location.hash.slice(1).split('?')[0]
  const queryString =
    document.location.hash.slice(1).split('?').length === 2
      ? document.location.hash.slice(1).split('?')[1]
      : ''

  const url = address.toLowerCase() || '/'
  const r = url.split('/')
  const q = queryString.split('=')
  return {
    resource: r[1],
    id: r[2],
    verb: r[3],
    name: q[0],
    value: q[1],
  }
}


window.addEventListener('load', router)

auth.onAuthStateChanged((user) => {
  const redirectPath = user ? window.location.hash : '/#/auth'
  if (window.location.hash !== redirectPath) {
    window.location.href = redirectPath
  }
})

window.addEventListener('hashchange', router)