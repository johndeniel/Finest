class Component extends HTMLElement {
  constructor() {
    super()
  
    this.innerHTML = /*html*/`
      <ul>
        <li><a href="/">Swipe</a></li>
        <li><a href="/#/gallery">Gallery</a></li>
        <li><a href="/#/about">About</a></li>
        <li><a href="/#/auth">Logout</a></li>
      </ul>
    `
  }
}
  
// Define the custom component 
customElements.define('custom-navigation-component', Component)