class SideNavigation extends HTMLElement {
  constructor() {
    super()
  
    this.innerHTML = /*html*/`
      <ul>
        <li><a href="/swipe">Swipe</a></li>
        <li><a href="/gallery">Gallery</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    `
  }
}
  
customElements.define('side-navigation', SideNavigation)
  