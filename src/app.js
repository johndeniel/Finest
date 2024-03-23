import { auth } from './utils/firebase/database'
import renderAuth from './views/auth_view'
import renderSwipe from './views/swipe_view'
import renderGallery from './views/gallery_view'
import renderAbout from './views/about_view'
import renderChat from './views/chat_view'
import error404 from './views/error_view'
import { parseRequestUrl } from './utils/parser'


// Define routes with corresponding view rendering functions
const routes = {
  '/': renderSwipe,
  '/auth': renderAuth,
  '/gallery': renderGallery,
  '/about': renderAbout,
  '/chat/:id': renderChat,
}


// Router function to handle routing and rendering based on the current URL
const router = async () => {
  // Parse the request URL using the parseRequestUrl function to extract information such as resource, id, verb, name, and value.
  const request = parseRequestUrl()

  // Construct the parsed URL based on the request properties:
  // - If a resource exists, add it to the URL with a leading slash, otherwise default to '/'
  // - If an id exists, add '/:id' to the URL to signify a parameterized route
  // - If a verb exists, add it to the URL preceded by a slash
  const parseUrl =
  (request.resource ? `/${request.resource}` : '/') +   // Add resource to URL with leading slash or default to '/'
  (request.id ? '/:id' : '') +                          // Add '/:id' if id exists for parameterized route
  (request.verb ? `/${request.verb}` : '')              // Add verb to URL preceded by a slash if it exists


  // Get the corresponding rendering function for the parsed URL or display 404 error if route not found
  const screen = routes[parseUrl] ? routes[parseUrl] : error404

  // Get the app container element and render the screen content
  const app = document.getElementById('app')
  app.innerHTML = await screen.render()
}

// Call the router function when the window loads to render the initial screen
window.addEventListener('load', router)


// Listen for changes in authentication state
auth.onAuthStateChanged((user) => {
  // Determine the redirect path based on authentication status
  const redirectPath = user ? window.location.hash : '/#/auth'

  // Redirect to the appropriate path if the current URL hash does not match the redirect path
  if (window.location.hash !== redirectPath) {
    window.location.href = redirectPath
  }
})


// Listen for changes in the URL hash and call the router function accordingly
window.addEventListener('hashchange', router)