// Import necessary functions and classes
import { get } from 'firebase/database'
import { Item } from '../utils/models/item.js'
import { getItemsDatabaseReference } from '../utils/firebase/database.js'

// Define the SwipeItem custom element
class GalleryItem extends HTMLElement {
  constructor() {
    super()
  }

  // Callback when the element is connected to the DOM
  async connectedCallback() {
    try {
      // Define HTML content for the item card
      const htmlContent = `
        <div class="timeline">
          <!-- Timeline items will be rendered here -->
        </div>
      `

      // Set the HTML content to the component
      this.innerHTML = htmlContent

      // Fetch data and initialize the item card
      await fetchData()
    } catch (error) {
      console.error('Error rendering item card:', error)
    }
  }
}

// Global variable
let listOfItems = [] // Array to store fetched items

// Function to fetch data from the database
async function fetchData() {
  try {
    // Get the database reference
    const itemsRef = getItemsDatabaseReference()

    // Fetch the data once
    const snapshot = await get(itemsRef)

    if (snapshot.exists()) {
      // Data exists, extract the value
      const data = snapshot.val()

      // Process the data (create Item instances)
      listOfItems = Object.values(data).map(itemData => new Item(
        itemData.key,
        itemData.userId,
        itemData.avatar,
        itemData.fullName,
        itemData.title,
        itemData.description,
        itemData.fileName,
        itemData.imageUrl
      ))

      // Log the items
      console.log('Items:', listOfItems)

      // Render all items on the timeline
      renderTimeline(listOfItems)
    } else {
      console.log('No data available')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Function to render all items on the timeline
function renderTimeline(items) {
  const timeline = document.querySelector('.timeline')

  items.forEach(item => {
    const itemCard = createItemCard(item)
    timeline.appendChild(itemCard)
  })
}

// Function to create an item card
function createItemCard(item) {
  const card = document.createElement('div')
  card.id = 'item-card'
  card.classList.add('item-card')

  const itemInfo = document.createElement('div')
  itemInfo.id = 'item-info'

  const title = document.createElement('h2')
  title.textContent = item.getTitle()
  title.id = 'item-title'

  const author = document.createElement('p')
  author.textContent = `By: ${item.getFullName()}`
  author.id = 'item-author'

  const description = document.createElement('p')
  description.textContent = item.getDescription()
  description.id = 'item-description'

  const swipeLeft = document.createElement('div')
  swipeLeft.textContent = 'Edit'
  swipeLeft.classList.add('edit-item')

  const swipeRight = document.createElement('div')
  swipeRight.textContent = 'Delete'
  swipeRight.classList.add('delete-item')

  const image = document.createElement('img')
  image.src = item.getImageUrl()
  image.id = 'item-img'

  itemInfo.appendChild(title)
  itemInfo.appendChild(author)
  itemInfo.appendChild(description)
  itemInfo.appendChild(swipeLeft)
  itemInfo.appendChild(swipeRight)

  card.appendChild(itemInfo)
  card.appendChild(image)

  return card
}

// Define the custom element
customElements.define('gallery-item', GalleryItem)
