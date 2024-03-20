import renderHome from './views/home'
import { parseRequestUrl } from './utils/utils'
import Error404 from './views/Error404'
import renderAuth from './views/auth'

const routes = {
  '/': renderHome,
  '/auth': renderAuth
}
const router = async () => {
  //showLoading()
  const request = parseRequestUrl()
  const parseUrl =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? `/${request.verb}` : '')
  console.log(request)
  const screen = routes[parseUrl] ? routes[parseUrl] : Error404

  const app = document.getElementById('app')
  app.innerHTML = await screen.render()
  if (screen.after_render) await screen.after_render()
  //hideLoading()
}
window.addEventListener('load', router)
window.addEventListener('hashchange', router)