import '../components/navigation.js'
import '../components/contact.js'

export default async function renderHome() {

  const htmlContent = /*html*/ `
    <aside>
      <side-navigation></side-navigation>
    </aside>

    <main>
    </main> 

    <aside>
      <contact-list></contact-list>
    </aside> 
  `

  return htmlContent
}