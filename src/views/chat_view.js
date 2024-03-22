import '../components/navigation.js'
import '../components/contact.js'
import '../components/chat.js'

const renderChat = {
  render: async () => {  
    return /*html*/ ` 
      <div class="container">
        <aside class="left-aside">
          <side-navigation></side-navigation>
        </aside>

        <main class="main-content">
          <custom-chat-element></custom-chat-element>
        </main>

        <aside class="right-aside">
          <contact-list></contact-list>
        </aside> 
      </div>
    `
  },
}

export default renderChat