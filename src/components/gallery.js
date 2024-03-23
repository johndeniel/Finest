// Import necessary functions and classes
import { get } from 'firebase/database'
import { uploadBytesResumable, ref, getStorage, getDownloadURL } from 'firebase/storage'
import { Item } from '../utils/models/item.js'
import { getItemsDatabaseReference } from '../utils/firebase/database.js'
import { auth } from '../utils/firebase/database.js'
import { push, update } from 'firebase/database'
import { getAuth } from 'firebase/auth'


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

        <!-- Floating Action Button (FAB) -->
        <button class="gallery-fab-button">Upload Image</button>
      
        <!-- Upload Image Dialog -->
        <div class="gallery-upload-dialog">
          <div class="gallery-upload-card">
            <div class="gallery-card-title">Upload Image</div> 

            <form class="gallery-upload-form">
              <!-- Display selected image -->
              <img class="gallery-uploaded-image" src="#" alt="Selected Image" style="display: none;">
      
              <div class="hint">Choose an image:</div>
              <input type="file" class="gallery-upload-image" name="imageFile" accept="image/*" required>
      
              <div class="hint">Title:</div>
              <input type="text" class="gallery-upload-title" name="title" required>
      
              <div class="hint">Description:</div>
              <textarea class="gallery-upload-description" name="description" rows="4" required></textarea>
      
              <!-- Cancel and Upload buttons in the same line -->
              <div class="button-container">
                <button type="button" class="gallery-cancel-button">Cancel</button>
                <button type="submit">Upload</button>
              </div>
            </form>
          </div>
        </div>
      `
      // Set the HTML content to the component
      this.innerHTML = htmlContent

      // Call the script function to handle authentication state and data fetching
      await script()



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
        // Initialize the upload FAB button and related functionality
        await initializeUploadFab(user)

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



// Initializes the Floating Action Button (FAB) for uploading images and handles related logic.
async function initializeUploadFab(user) {
  // Get the FAB button and upload dialog elements by class name
  const fabButton = document.querySelector('.gallery-fab-button')
  const uploadDialog = document.querySelector('.gallery-upload-dialog')

  // Event listener for FAB button click to show the upload dialog
  fabButton.addEventListener('click', () => {
    uploadDialog.classList.add('active') // Show the upload dialog
  })

  // Event listener for closing the upload dialog when clicked outside the form
  uploadDialog.addEventListener('click', (event) => {
    if (event.target === uploadDialog) {
      uploadDialog.classList.remove('active') // Hide the upload dialog if clicked outside the form
    }
  })

  // Event listener for clicking the cancel button to hide the upload dialog
  const cancelButton = document.querySelector('.gallery-cancel-button')

  cancelButton.addEventListener('click', () => {
    uploadDialog.classList.remove('active') // Hide the upload dialog when cancel button is clicked
  })

  // Event listener for selecting an image and displaying it
  const uploadImageInput = document.querySelector('.gallery-upload-image')
  const uploadedImage = document.querySelector('.gallery-uploaded-image')

  uploadImageInput.addEventListener('change', () => {
    const file = uploadImageInput.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function(e) {
        uploadedImage.src = e.target.result
        uploadedImage.style.display = 'block' // Show the uploaded image
      }
      reader.readAsDataURL(file)
    } else {
      uploadedImage.src = '#' // Reset image source if no file selected
      uploadedImage.style.display = 'none' // Hide the image container
    }
  })

  // Event listener for submitting the upload form and handling upload logic
  const uploadForm = document.querySelector('.gallery-upload-form')
  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault() // Prevent default form submission

    // Retrieve data from form fields
    const uploadImage = uploadForm.querySelector('.gallery-upload-image').files[0]
    const uploadTitle = uploadForm.querySelector('.gallery-upload-title').value
    const uploadDescription = uploadForm.querySelector('.gallery-upload-description').value

    // Example: Log the uploaded data
    console.log('Uploaded Image:', uploadImage)
    console.log('Title:', uploadTitle)
    console.log('Description:', uploadDescription)

    // Clear the form and hide the upload dialog after handling upload logic
    uploadForm.reset()
    uploadDialog.classList.remove('active')

   
    await uploadFile(user, uploadImage, uploadTitle, uploadDescription)
  })
}

async function uploadFile(user, uploadImage, uploadTitle, uploadDescription) {
  try {

    const storage = getStorage()
    const PHOTO_REFERENCE = 'uploads'
    const uniqueFileName = 'image_' + Date.now() + '.jpg'
    const storageRef = ref(storage, `${PHOTO_REFERENCE}/${user.uid}/${uniqueFileName}`)
    const uploadTask = uploadBytesResumable(storageRef, uploadImage)

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused')
          break
        case 'running':
          console.log('Upload is running')
          break
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break
        case 'storage/canceled':
          // User canceled the upload
          break

          // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log('File available at', downloadURL)
          await reatime(user, uploadImage, uploadTitle, uploadDescription, uniqueFileName, downloadURL)
         
        })
      }
    )
  } catch (error) {
    console.error('Error in uploadFile:', error.message)
    // Handle other types of errors, if any
  }
}




async function reatime(user, uploadImage, uploadTitle, uploadDescription, uniqueFileName, downloadURL) {
  try {

    const auth = getAuth()
    const temp = auth.currentUser
    // Get a key for a new Post.
    const newPostKey = push(getItemsDatabaseReference()).key

    // Create the data object to be uploaded to the databaseS
    const postData = new Item(
      newPostKey, 
      user.uid,
      temp.photoURL,
      temp.displayName,
      uploadTitle,
      uploadDescription,
      uniqueFileName,
      downloadURL
    )

    // Construct the update object with the data to be updated
    const updates = {}
    updates[newPostKey] = postData

    // Update the database with the new data under the generated key
    await update(getItemsDatabaseReference(), updates)

    console.log('Data updated successfully in Firebase Realtime Database')
  } catch (error) {
    console.error('Error updating data in Firebase Realtime Database:', error.message)
    // Handle database update failure
  }
}


// Define the custom component 
customElements.define('custom-gallery-component', Component)