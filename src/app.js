import renderAuth from './views/auth_view'
import renderSwipe from './views/swipe_view'
import renderGallery from './views/gallery_view'
import renderAbout from './views/about_view'
import error404 from './views/error_view'
import { parseRequestUrl } from './utils/utils'

const routes = {
  '/': renderSwipe,
  '/auth': renderAuth,
  '/gallery': renderGallery,
  '/about': renderAbout

}
const router = async () => {
  //showLoading()
  const request = parseRequestUrl()
  const parseUrl =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? `/${request.verb}` : '')
  console.log(request)
  const screen = routes[parseUrl] ? routes[parseUrl] : error404

  const app = document.getElementById('app')
  app.innerHTML = await screen.render()
  if (screen.after_render) await screen.after_render()
  //hideLoading()
}
window.addEventListener('load', router)
window.addEventListener('hashchange', router)