// Import necessary functions and classes
import { get } from 'firebase/database'
import { Item } from '../utils/models/item.js'
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
        <div class="timeline">
          <!-- Timeline items will be rendered here -->
        </div>
      `
      
      // Call the script function to handle authentication state and data fetching
      await script()

      // Set the HTML content to the component
      this.innerHTML = htmlContent

    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error rendering item card in connectedCallback:', error)

      // Throw a new Error with a specific message for rendering failure
      throw new Error('Failed to render item card. Please check your network connection, reload the page, and try again.')
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
        const itemsData = await fetchItemsFromDatabase() 

        // Render the timeline with the fetched items data
        renderTimelineWithItems(itemsData)

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



// Function to fetch data from the database
async function fetchItemsFromDatabase() {
  try {
    // Initialize an empty array to store fetched items
    let fetchedItemsArray = [] 

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

      // Return the array of fetched items
      return fetchedItemsArray
     
    } else {
      // Log an error message if there is no data available in the items collection
      console.error('No data available in fetchData function')

      // Return an empty array in case of an error
      return [] 
    }

  } catch (error) {
    // Log an error message if there is an issue fetching items from the database
    console.error('Error fetching data in fetchData function:', error)

    // Return an empty array in case of an error
    return []
  }
}



// Function to render all items on the timeline
function renderTimelineWithItems(items) {
  try{
    // Check if items data is available
    if(!items) {
      // Log an error message if there is no data available in the items collection
      console.error('No data available in renderTimelineWithItems function')
    }
    // Get the timeline container element
    const timeline = document.querySelector('.timeline')

    // Iterate through each item and create a card for it
    items.forEach(item => {
      // Create a card for the item
      const itemCard = createItemCard(item)

      // Append the item card to the timeline container
      timeline.appendChild(itemCard)
    })

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error rendering item card in renderTimelineWithItems function:', error)

    // Throw a new Error with a specific message for rendering failure
    throw new Error('Failed to render item card. Please check your network connection and try again.')
  }
}



// Function to create an item card
function createItemCard(item) {
  try {
    // Check if items data is available
    if(!item) {
      // Log an error message if there is no data available in the items collection
      console.error('No data available in createItemCard function')
    }

    // Create a card container for the item
    const cardContainer = document.createElement('div')
    cardContainer.classList.add('card-item-container')

    // Create the item information container
    const itemInfo = document.createElement('div')
    itemInfo.classList.add('item-info-container')

    // Create and set the title element
    const titleElement = document.createElement('h2')
    titleElement.classList.add('item-title')
    titleElement.textContent = item.getTitle()
    
    // Create and set the author element
    const authorElement = document.createElement('p')
    authorElement.classList.add('item-author')
    authorElement.textContent = `By: ${item.getFullName()}`

    // Create and set the description element
    const descriptionElement = document.createElement('p')
    descriptionElement.classList.add('item-description')
    descriptionElement.textContent = item.getDescription()

    // Create and set the edit action button
    const editButton = document.createElement('div')
    editButton.classList.add('item-edit-action')
    editButton.textContent = 'Edit'

    // Create and set the delete action button
    const deleteButton = document.createElement('div')
    deleteButton.classList.add('item-delete-action')
    deleteButton.textContent = 'Delete'
   
    // Create and set the like action button
    const likeButton = document.createElement('div')
    likeButton.classList.add('item-like-action')
    likeButton.textContent = 'Like'

    // Create and set the image element
    const imageElement = document.createElement('img')
    imageElement.classList.add('item-img')
    imageElement.src = item.getImageUrl()
   
    // Append all elements to the item information container
    itemInfo.appendChild(titleElement)
    itemInfo.appendChild(authorElement)
    itemInfo.appendChild(descriptionElement)
    itemInfo.appendChild(editButton)
    itemInfo.appendChild(deleteButton)
    itemInfo.appendChild(likeButton)

    // Append the item information container and image to the card container
    cardContainer.appendChild(itemInfo)
    cardContainer.appendChild(imageElement)

    // Return the created card container
    return cardContainer 

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error creating item card:', error)

    // Return null in case of error
    return null 
  }
}

// Define the custom component 
customElements.define('custom-gallery-component', Component)