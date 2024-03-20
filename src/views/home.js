import '../components/navigation.js'
import '../components/contact.js'
import { getItemsDatabaseReference } from '../utils/firebase/database.js'
import { get } from 'firebase/database'
import { Item } from '../utils/models/item'

// Function to render the home page content
const renderHome = {
  render: async () => {

    initializeApp() // Initialize the application when rendering the home page

    return /*html*/ ` 
      <div class="container">
        <aside class="left-aside">
          <side-navigation></side-navigation>
        </aside>

        <main class="main-content">
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
        </main>

        <aside class="right-aside">
          <contact-list></contact-list>
        </aside> 
      </div>
    `
  },
}

// Define listOfItems outside of initializeApp to make it accessible in event handlers
let listOfItems = []
let counter = 0

function handleSwipeLeft(event) {
  const button = event.target.closest('.swipe-left')
  if (button) {
    updateItemCard(listOfItems[1])
  }
}

function handleSwipeRight(event) {
  const button = event.target.closest('.swipe-right')
  if (button) {
    updateItemCard(listOfItems[counter++])
  }
}

// Function to update the item card with item details
function updateItemCard(item) {
  const itemTitle = document.getElementById('item-title')
  const itemAuthor = document.getElementById('item-author')
  const itemDescription = document.getElementById('item-description')
  const itemImg = document.getElementById('item-img')

  itemTitle.textContent = item.getTitle()
  itemAuthor.textContent = `By: ${item.getFullName()}`
  itemDescription.textContent = item.getDescription()
  itemImg.src = item.getImageUrl()
}

// Function to fetch data and initialize the application
async function initializeApp() {
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

      // Example: Log the items
      console.log('Items:', listOfItems)

      // Attach click listeners after fetching data
      document.querySelector('.swipe-left').addEventListener('click', handleSwipeLeft)
      document.querySelector('.swipe-right').addEventListener('click', handleSwipeRight)

      // Render the first item on the card
      updateItemCard(listOfItems[0])
    } else {
      console.log('No data available')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export default renderHome