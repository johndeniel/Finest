import '../components/navigation.js'
import '../components/contact.js'
import '../components/chat.js'

const renderChat = {
  render: async () => {  
    return /*html*/ ` 
      <div class="root-container">
        <aside class="left-aside">
          <custom-navigation-component></custom-navigation-component>
        </aside>

        <main class="main-content">
          <custom-chat-component></custom-chat-component>
        </main>

        <aside class="right-aside">
          <custom-contact-list-component></custom-contact-list-component>
        </aside> 
      </div>
    `
  },
}

export default renderChat