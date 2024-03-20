class SideNavigation extends HTMLElement {
  constructor() {
    super()
  
    this.innerHTML = /*html*/`
      <ul>
        <li><a href="/#/auth" data-link>Swipe</a></li>
        <li><a href="/gallery" data-link>Gallery</a></li>
        <li><a href="/about" data-link>About</a></li>
        <li><a href="/logout" data-link>Logout</a></li>
      </ul>
    `
  }
}
  
customElements.define('side-navigation', SideNavigation)