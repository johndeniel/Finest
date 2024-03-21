import { get } from 'firebase/database'
import { Item } from '../utils/models/item'
import { getItemsDatabaseReference } from '../utils/firebase/database.js'

// Define the SwipeItem custom element
class SwipeItem extends HTMLElement {
  constructor() {
    super()
  }

  // Callback when the element is connected to the DOM
  async connectedCallback() {
    try {
      // Define HTML content for the item card
      const htmlContent = `
        <div id="item-card">
          <div id="item-info">
            <h1 id="item-title"></h1>
            <p id="item-author"></p>
            <p id="item-description"></p>
            <div class="swipe-left">Swipe Left</div>
            <div class="swipe-right">Swipe Right</div>
          </div>
          <img id="item-img" src="">
        </div>
      `

      // Set the HTML content to the component
      this.innerHTML = htmlContent

      // Attach event listeners
      document.querySelector('.swipe-left').addEventListener('click', handleSwipeLeft)
      document.querySelector('.swipe-right').addEventListener('click', handleSwipeRight)

      // Fetch data and initialize the item card
      await fetchData()
    } catch (error) {
      console.error('Error rendering item card:', error)
    }
  }
}

// Global variables
let listOfItems = [] // Array to store fetched items
let counter = 0 // Counter for item navigation

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

      // Render the first item on the card
      updateItemCard(listOfItems[0])
    } else {
      console.log('No data available')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Function to handle swipe left event
function handleSwipeLeft(event) {
  const button = event.target.closest('.swipe-left')
  if (button) {
    updateItemCard(listOfItems[1]) // Update item card with next item
  }
}

// Function to handle swipe right event
function handleSwipeRight(event) {
  const button = event.target.closest('.swipe-right')
  if (button) {
    updateItemCard(listOfItems[counter++]) // Update item card with previous item
  }
}

// Function to update the item card with item details
function updateItemCard(item) {
  const itemTitle = document.getElementById('item-title')
  const itemAuthor = document.getElementById('item-author')
  const itemDescription = document.getElementById('item-description')
  const itemImg = document.getElementById('item-img')

  // Update item card elements
  itemTitle.textContent = item.getTitle()
  itemAuthor.textContent = `By: ${item.getFullName()}`
  itemDescription.textContent = item.getDescription()
  itemImg.src = item.getImageUrl()
}

// Define the custom element
customElements.define('swipe-item', SwipeItem)