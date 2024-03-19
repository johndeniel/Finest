import home from './views/home.js'
import auth from './views/auth.js'
import contact from './views/contact.js'

const routes = {
  '/': { title: 'Home', render: home },
  '/auth': { title: 'Auth', render: auth },
  '/contact': { title: 'Contact', render: contact },
}

async function router() {
  let view = routes[location.pathname]

  if (view) {
    document.title = view.title
    // eslint-disable-next-line no-undef
    app.innerHTML = await view.render()
  } else {
    history.replaceState('', '', '/')
    router()
  }
}

// Handle navigation
window.addEventListener('click', e => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault()
    history.pushState('', '', e.target.href)
    router()
  }
})

// Update router
window.addEventListener('popstate', router)
window.addEventListener('DOMContentLoaded', router)