import '../components/navigation.js'
import '../components/contact.js'

const renderAbout = {
  render: async () => {
    return /*html*/ ` 
      <div class="root-container">
        <aside class="left-aside">
          <custom-navigation-component></custom-navigation-component>
        </aside>

        <main class="main-content">
          <h1> About </h1>
        </main>

        <aside class="right-aside">
          <custom-contact-list-component></custom-contact-list-component>
        </aside> 
      </div>
    `
  },
}

export default renderAbout