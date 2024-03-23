import { get } from 'firebase/database'
import { Item } from '../utils/models/item'
import { getItemsDatabaseReference } from '../utils/firebase/database.js'
import { auth } from '../utils/firebase/database.js'

class Component extends HTMLElement {
  constructor() {
    super()
  }

  // Callback when the element is connected to the DOM
  async connectedCallback() {
    try {
      // Define HTML content for the item card
      const htmlContent = ` 
        <div class="card-item-container">
          <div class="item-info-container">
            <h1 class="item-title"></h1>
            <p class="item-author"></p>
            <p class="item-description"></p>
            <div class="item-swipe-left">Swipe Left</div>
            <div class="item-swipe-right">Swipe Right</div>
            <div class="item-chat-action">Chat</div>
          </div>
          <img class="item-img" src="">
        </div>
      `

      // Call the script function to handle authentication state and data fetching
      await script()

      // Set the HTML content to the component
      this.innerHTML = htmlContent

    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error rendering item card in connectedCallback:', error)

      // Throw a new Error with a specific message for failed data fetching
      throw new Error('Failed to render item card. Please check your network connection and try again.')
    }
  }
}



// Asynchronous function to handle authentication state changes and fetch data accordingly
async function script() {
  try {
    // Listen for changes in authentication state
    auth.onAuthStateChanged(async (user) => {
    
      // Listen for changes in authentication state
      if (user) {
        // Fetch items data from the database using fetchItemsFromDatabase function
        await fetchItemsFromDatabase() 

      } else {
        // Log a message if the user is not authenticated
        console.log('User is not authenticated in script function')

        // Redirect to the authentication page
        window.location.href = '/#/auth'
      }
    })

  } catch (error) {
    // Log an error message for the catch block
    console.error('Error in auth state change in script function:', error)

    // Throw a new Error with a specific message for failed chat fetching
    throw new Error('Failed to fetch chat data. Please try again later.')
  }
}



// Global variables
let fetchedItemsArray = [] 
let counter = 0 


// Function to fetch data from the database
async function fetchItemsFromDatabase() {
  try {
    // Get the Firestore reference to the collection containing items
    const itemsCollectionRef = getItemsDatabaseReference()

    // Fetch a snapshot of the items collection data from Firestore
    const snapshot = await get(itemsCollectionRef)

    // Check if the snapshot contains data (documents) in the items collection
    if (snapshot.exists()) {
      // Extract the value (data) from the snapshot
      const data = snapshot.val()

      // Iterate through the retrieved data to create Item instances 
      fetchedItemsArray = Object.values(data).map(temp => new Item(
        temp.key,
        temp.userId,
        temp.avatar,
        temp.fullName,
        temp.title,
        temp.description,
        temp.fileName,
        temp.imageUrl
      ))

      // Render the first item on the card
      updateItemCard(fetchedItemsArray[0])

    } else {
      // Log an error message if there is no data available
      console.error('No data available in fetchData function')
    }

  } catch (error) {
    // Log an error message if there is an issue fetching items from the database.
    console.error('Error fetching items data in fetchData function:', error)

    // Throw a new Error with a specific message for failed data fetching
    throw new Error('Failed to fetch data. Please check your network connection and try again.')
  }
}



// Function to handle swipe left event
function handleSwipeLeft(event) {
  try{
    // Validate if the event object exists
    if(!event) {
      // Log an error message if the event object is missing
      console.error('Error: Event object is required in handleSwipeLeft function.')
    }

    // Find the closest ancestor element with the class 'swipe-left' from the target element of the event
    const button = event.target.closest('.item-swipe-left')

    // Check if the closest ancestor element with the class 'swipe-left' exists
    if (button) {
      // Update the item card with the next item in the fetched items array
      updateItemCard(fetchedItemsArray[++counter]) 
    }

  } catch (error) {
    // Log an error message if there is an issue handling the swipe left event
    console.error('Error handling swipe left event:', error)

    // Throw a new Error with a specific message for failed event handling
    throw new Error('Failed to handle swipe left event. Please try again.')
  }
}



// Function to handle swipe right event
function handleSwipeRight(event) {
  try{
    // Validate if the event object exists
    if(!event) {
      // Log an error message if the event object is missing
      console.error('Error: Event object is required in handleSwipeRight function.')
    }

    // Find the closest ancestor element with the class 'swipe-right' from the target element of the event
    const button = event.target.closest('.item-swipe-right')

    // Check if the closest ancestor element with the class 'swipe-right' exists
    if (button) {
      // Update the item card with the next item in the fetched items array
      updateItemCard(fetchedItemsArray[++counter]) 
    }

  } catch (error) {
    // Log an error message if there is an issue handling the swipe right event
    console.error('Error handling swipe right event:', error)

    // Throw a new Error with a specific message for failed event handling
    throw new Error('Failed to handle swipe right event. Please try again.')
  }
}



// Function to handle swipe chat event
function handleSwipeChat(event) {
  try{
    // Validate if the event object exists
    if(!event) {
      // Log an error message if the event object is missing
      console.error('Error: Event object is required in handleSwipeChat function.')
    }
    
    // Find the closest ancestor element with the class 'swipe-chat' from the target element of the event
    const button = event.target.closest('.item-chat-action')

    // Check if the closest ancestor element with the class 'swipe-chat' exists
    if (button) {
      // Perform action with contact ID, e.g., open chat or profile
      document.location.hash = `/chat/${fetchedItemsArray[counter].getUserId()}`
    }

  } catch (error) {
    // Log an error message if there is an issue handling the swipe chat event
    console.error('Error handling swipe chat event:', error)

    // Throw a new Error with a specific message for failed event handling
    throw new Error('Failed to handle swipe chat event. Please try again.')
  }
}



// Function to update the item card with item details
function updateItemCard(item) {
  try {
    // Check if items data is available
    if(!item) {
      // Log an error message if there is no data available in the items collection
      console.error('No data available in updateItemCard function')
    }

    // Update item title
    const itemTitle = document.querySelector('.item-title')
    itemTitle.textContent = item.getTitle()

    // Update item author
    const itemAuthor = document.querySelector('.item-author')
    itemAuthor.textContent = `By: ${item.getFullName()}`

    // Update item description
    const itemDescription = document.querySelector('.item-description')
    itemDescription.textContent = item.getDescription()

    // Update item image
    const itemImg = document.querySelector('.item-img')
    itemImg.src = item.getImageUrl()

    // Attach event listeners for swipe actions
    document.querySelector('.item-swipe-left').addEventListener('click', handleSwipeLeft)
    document.querySelector('.item-swipe-right').addEventListener('click', handleSwipeRight)
    document.querySelector('.item-chat-action').addEventListener('click', handleSwipeChat)

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error updating item card:', error)
    
    // Throw a new Error with a specific message for rendering failure
    throw new Error('Failed to render item card. Please check your network connection and try again.')
  }
}


// Define the custom component 
customElements.define('custom-swipe-component', Component)