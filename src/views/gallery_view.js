import '../components/navigation.js'
import '../components/contact.js'
import '../components/gallery.js'

const renderGallery = {
  render: async () => {
    return /*html*/ ` 
      <div class="root-container">
        <aside class="left-aside">
          <custom-navigation-component></custom-navigation-component>
        </aside>

        <main class="main-content">
          <custom-gallery-component></custom-gallery-component>
        </main>

        <aside class="right-aside">
          <custom-contact-list-component></custom-contact-list-component>
        </aside> 
      </div>
    `
  },
}

export default renderGallery