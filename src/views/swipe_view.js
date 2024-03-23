import '../components/navigation.js'
import '../components/contact.js'
import '../components/swipe.js'

const renderSwipe = {
  render: async () => {
    return /*html*/ ` 
      <div class="root-container">
        <aside class="left-aside">
          <custom-navigation-component></custom-navigation-component>
        </aside>

        <main class="main-content">
          <custom-swipe-component></custom-swipe-component>
        </main>

        <aside class="right-aside">
          <custom-contact-list-component></custom-contact-list-component>
        </aside> 
      </div>
    `
  },
}

export default renderSwipe