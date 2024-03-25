// Import necessary functions and classes

import { uploadBytesResumable, ref, getStorage, getDownloadURL, deleteObject } from 'firebase/storage'
import { Item } from '../utils/models/item.js'
import { getItemsDatabaseReference } from '../utils/firebase/database.js'
import { auth } from '../utils/firebase/database.js'
import { push, get, update } from 'firebase/database'
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
        <button class="gallery-upload-fab-button">Add Item</button>
      
        <!-- Upload Image Dialog -->
        <div class="gallery-upload-dialog">
          <div class="gallery-upload-card">
            <div class="gallery-upload-card-title">Upload Image</div>

            <form class="gallery-upload-form">

              <!-- Display selected image -->
              <img class="gallery-upload-uploaded-image" src="#" alt="Selected Image" style="display: none;">

              <div class="gallery-upload-hint">Choose an image:</div>
              <input type="file" class="gallery-upload-image" name="imageFile" accept="image/*" required>

              <div class="gallery-upload-hint">Title:</div>
              <input type="text" class="gallery-upload-title" name="title" required>

              <div class="gallery-upload-hint">Description:</div>
              <textarea class="gallery-upload-description" name="description" rows="4" required></textarea>

              <!-- Cancel and Upload buttons in the same line -->
              <div class="gallery-upload-button-container">
                <button type="button" class="gallery-upload-cancel-button">Cancel</button>
                <button type="submit">Upload</button>
              </div>

            </form>
          </div>
        </div>

        <!-- Edit Dialog -->
        <div class="gallery-edit-dialog">
          <div class="gallery-edit-card">
            <div class="gallery-edit-card-title">Edit Item</div>

            <form class="gallery-edit-form">

              <div class="gallery-edit-hint">Title:</div>
              <input type="text" class="gallery-edit-title" name="galleryEditTitle" required>

              <div class="gallery-edit-hint">Description:</div>
              <textarea id="gallery-edit-description" class="gallery-edit-description" name="galleryEditDescription" rows="4" required></textarea>

              <!-- Cancel and Save buttons in the same line -->
              <div class="gallery-edit-button-container">
                <button type="button" class="gallery-edit-cancel-button">Cancel</button>
                <button type="submit">Save</button>
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
        await initializeUploadFab()

        // Fetch items data from the database using fetchItemsFromDatabase function
        const box = await fetchItemsFromDatabase() 

        // Render the timeline with the fetched items data
        renderTimelineWithItems(box)

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
      fetchedItemsArray = Object.values(data).map(box => new Item(
        box.key,
        box.userId,
        box.avatar,
        box.fullName,
        box.title,
        box.description,
        box.fileName,
        box.imageUrl
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
function renderTimelineWithItems(box) {
  try{
    // Check if items data is available
    if(!box) {
      // Log an error message if there is no data available in the items collection
      console.error('No data available in renderTimelineWithItems function')
    }

    // Get the timeline container element
    const timeline = document.querySelector('.timeline')

    // Iterate through each item and create a card for it
    for (let i = box.length - 1; i >= 0; i--) {
      // Get the current box from the array based on the current iteration index
      const boxTemp = box[i]

      // Create a card for the item
      const card = createItemCard(boxTemp)

      // Append the card to the timeline container
      timeline.appendChild(card)
    }

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error rendering item card in renderTimelineWithItems function:', error)

    // Throw a new Error with a specific message for rendering failure
    throw new Error('Failed to render item card. Please check your network connection and try again.')
  }
}



// Function to create an item card
function createItemCard(box) {
  try {
    // Check if items data is available
    if(!box) {
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
    titleElement.textContent = box.getTitle()
    
    // Create and set the author element
    const authorElement = document.createElement('p')
    authorElement.classList.add('item-author')
    authorElement.textContent = `By: ${box.getFullName()}`

    // Create and set the description element
    const descriptionElement = document.createElement('p')
    descriptionElement.classList.add('item-description')
    descriptionElement.textContent = box.getDescription()

    // Create and set the edit action button
    const editButton = document.createElement('div')
    editButton.classList.add('item-edit-action')
    editButton.textContent = 'Edit'

    // Add event listener to the edit button
    editButton.addEventListener('click', () => {
      // Call function to open edit dialog when edit button is clicked
      openGalleryEditDialog(box) 
    })

    // Create and set the delete action button
    const deleteButton = document.createElement('div')
    deleteButton.classList.add('item-delete-action')
    deleteButton.textContent = 'Delete'

    // Add event listener to the delete button
    deleteButton.addEventListener('click', () => {
      // Call function to open delete dialog when delete button is clicked
      deleteOnDatabase(box) 
    })
   
    // Create and set the like action button
    const likeButton = document.createElement('div')
    likeButton.classList.add('item-like-action')
    likeButton.textContent = 'Like'

    // Create and set the image element
    const imageElement = document.createElement('img')
    imageElement.classList.add('item-img')
    imageElement.src = box.getImageUrl()
   
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



// Function to open the edit dialog and populate it with box details
function openGalleryEditDialog(box) {
  try{
    // Check if items data is available
    if(!box) {
      // Log an error message if there is no data available in the items collection
      console.error('No data available in openGalleryEditDialog function')
    }

    // Get the edit dialog element by class name
    const editDialog = document.querySelector('.gallery-edit-dialog')

    // Event listener for submitting the upload form and handling upload logic
    const uploadForm = document.querySelector('.gallery-edit-form')

    // Select the title input field in the edit dialog
    const titleInput = editDialog.querySelector('.gallery-edit-title')
    // Set the value of the title input to the current item's title
    titleInput.value = box.getTitle()

    // Select the description input field in the edit dialog
    const descriptionInput = editDialog.querySelector('.gallery-edit-description')  
    // Set the value of the description input to the current item's description
    descriptionInput.value = box.getDescription()

    // Show the edit dialog
    editDialog.classList.add('active')

    // Get the cancel button inside the edit dialog
    const cancelButton = editDialog.querySelector('.gallery-edit-cancel-button')

    // Add event listener to the cancel button to hide the edit dialog
    cancelButton.addEventListener('click', () => {
      // Clear the form and hide the upload dialog after handling upload logic
      uploadForm.reset()

      // Hide the edit dialog
      editDialog.classList.remove('active')
    })

    // Add event listener for form submission
    uploadForm.addEventListener('submit', async (event) => {
      // Prevent default form submission
      event.preventDefault() 

      // Get the title and description values from the form
      const title = uploadForm.querySelector('.gallery-edit-title').value
      const description = uploadForm.querySelector('.gallery-edit-description').value

      // Call the function to handle editing the item in the database asynchronously
      await editItemToDatabase(box, title, description) 

      // Clear the form and hide the upload dialog after handling upload logic
      uploadForm.reset()
      editDialog.classList.remove('active')
    })
  
  } catch (error) {
    // Log an error message with the specific error message received from the catch block
    console.error('Error in openGalleryEditDialog:', error.message)

    // Throw a new Error with a specific message for failed data update
    throw new Error('Failed to update box data.')
  }
}



// Initializes the Floating Action Button (FAB) for uploading images and handles related logic.
async function initializeUploadFab() {
  // Get the FAB button and upload dialog elements by class name
  const fabButton = document.querySelector('.gallery-upload-fab-button')

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
  const cancelButton = document.querySelector('.gallery-upload-cancel-button')

  cancelButton.addEventListener('click', () => {
    // Clear the form 
    uploadForm.reset()

    // Remove the uploaded image
    uploadedImage.src = ''

    // Hide the upload dialog when cancel button is clicked
    uploadDialog.classList.remove('active') 
  })

  // Event listener for selecting an image and displaying it
  const uploadImageInput = document.querySelector('.gallery-upload-image')
  const uploadedImage = document.querySelector('.gallery-upload-uploaded-image')

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
    // Prevent default form submission
    event.preventDefault() 

    // Retrieve data from form fields
    const image = uploadForm.querySelector('.gallery-upload-image').files[0]
    const title = uploadForm.querySelector('.gallery-upload-title').value
    const description = uploadForm.querySelector('.gallery-upload-description').value

    // Call the function to upload image data to the database
    await uploadImageToDatabase( image, title, description)

    // Clear the form 
    uploadForm.reset()

    // Remove the uploaded image by resetting the src attribute
    uploadedImage.src = ''

    // Hide the upload dialog after handling upload logic
    uploadDialog.classList.remove('active')
  })
}



// Async function to upload an image file to Firebase Storage and add its details to the database
async function uploadImageToDatabase( image, title, description) {
  try {
    // Get the Cloud Storage instance
    const storage = getStorage()

    // Define the reference path for uploaded photos
    const PHOTO_REFERENCE = 'uploads'

    // Get the authentication instance
    const auth = getAuth()

    // Get the current user from the authentication instance
    const user = auth.currentUser
 
    // Retrieve user information for the item
    const userId = user.uid

    // Generate a unique file name for the uploaded image
    const fileName = 'image_' + Date.now() + '.jpg'
    
    // Create a reference to the storage location for the uploaded image
    const storageRef = ref(storage, `${PHOTO_REFERENCE}/${userId}/${fileName}`)

    // Upload the image to Cloud Storage and get an upload task object
    const uploadTask = uploadBytesResumable(storageRef, image)

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
          // Log an error message with the specific error message received from the catch block
          console.error('storage/unauthorized:', error.message)
          break

          // ...

        case 'storage/canceled':
          // User canceled the upload
          // Log an error message with the specific error message received from the catch block
          console.error('User canceled the upload:', error.message)
          break

          // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          // Log an error message with the specific error message received from the catch block
          console.error('storage/unknow:', error.message)
          break
        }
      }, 

      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // Call the function to add a new item to the database with the uploaded file's details
          await addNewItemToDatabase(title, description, fileName, downloadURL)
        })
      }
    )

  } catch (error) {
    // Log an error message with the specific error message received from the catch block
    console.error('Error in uploadFile:', error.message)
    
    // Throw a new Error with a specific message for failed data update
    throw new Error('Failed to update box data. Please try again later.')
  }
}



// Async function to add a new item to the database in real-time
async function addNewItemToDatabase(title, description, fileName, downloadURL) {
  try {  
    // Check if title data is available
    if (!title) {
      console.error('Error: Title data is missing')
    }
    
    // Check if description data is available
    if (!description) {
      console.error('Error: Description data is missing')
    }

    // Check if fileName data is available
    if (!fileName) {
      console.error('Error: FileName data is missing')
    }

    // Check if downloadURL data is available
    if (!downloadURL) {
      console.error('Error: DownloadURL data is missing')
    }

    // Generate a unique key for the new item
    const key = push(getItemsDatabaseReference()).key

    // Get the authentication instance
    const auth = getAuth()

    // Get the current user from the authentication instance
    const user = auth.currentUser

    // Retrieve user information for the item
    const userId = user.uid
    const avatar = user.photoURL
    const fullName = user.displayName

    // Create a new Item object representing the data for the new box to be uploaded to the database
    const box = new Item(
      key,            // Unique key for the new box
      userId,         // User ID of the box owner
      avatar,         // Avatar URL of the box owner
      fullName,       // Full name of the box owner
      title,          // Title of the box
      description,    // Description of the box
      fileName,       // File name of the box
      downloadURL     // Download URL of the box's content
    )

    // Construct the update object with the data to be updated 
    const newBox = {}

    // Add the new data (newBox) to the update object under the item's key
    newBox[key] = box

    // Use the firebase update predefined functions to commit the changes to the database.
    // Pass in the reference to the database and the update object (newBox) containing the new data.
    await update(getItemsDatabaseReference(), newBox)

  } catch (error) {
    // Log an error message with the specific error message received from the catch block
    console.error('Error updating data in Firebase Realtime Database:', error.message)

    // Throw a new Error with a specific message for failed data update
    throw new Error('Failed to update box data. Please try again later.')
  }
}



// Async function to edit an item's title and description in the database
async function editItemToDatabase(box, title, description) {
  try {
    // Check if items data is available
    if (!box) {
      console.error('Error: Box data is missing')
    }
    
    // Check if title data is available
    if (!title) {
      console.error('Error: Title data is missing')
    }
    
    // Check if description data is available
    if (!description) {
      console.error('Error: Description data is missing')
    }
    
    // Create a new data object representing the updated item to be uploaded to the database.
    // The new data includes the updated title and description, while other fields remain unchanged.
    const newBox = new Item(
      box.getKey(),       // Retain the item's existing key
      box.getUserId(),    // Retain the item's existing user ID
      box.getAvatar(),    // Retain the item's existing avatar
      box.getFullName(),  // Retain the item's existing full name
      title,              // Update the item's title with the new data
      description,        // Update the item's description with the new data
      box.getFileName(),  // Retain the item's existing file name
      box.getImageUrl()   // Retain the item's existing image URL
    )

    // Construct the update object with the data to be updated
    const editBox = {}

    // Add the new data (newBox) to the update object under the item's key
    editBox[box.getKey()] = newBox

    // Use the firebase update predefined functions to commit the changes to the database.
    // Pass in the reference to the database and the update object (editBox) containing the new data.
    await update(getItemsDatabaseReference(), editBox)

  } catch (error) {
    // Log an error message with the specific error message received from the catch block
    console.error('Error updating data in Firebase Realtime Database:', error.message)

    // Throw a new Error with a specific message for failed data update
    throw new Error('Failed to update box data. Please try again later.')
  }
}


async function deleteOnDatabase(box) {
  try {
    // Get the Cloud Storage instance
    const storage = getStorage()

    // Define the reference path for uploaded photos
    const PHOTO_REFERENCE = 'uploads'

    // Get the authentication instance
    const auth = getAuth()

    // Get the current user from the authentication instance
    const user = auth.currentUser
 
    // Retrieve user information for the item
    const userId = user.uid

    // Retrieve fileName information for the item
    const fileName = box. getFileName() 

    // Create a reference to the file to delete
    const desertRef = ref(storage, `${PHOTO_REFERENCE}/${userId}/${fileName}`)

    // Delete the file
    deleteObject(desertRef).then(() => {
      console.log('photo delete success')
    }).catch((error) => {
      // Log any errors that occur during the deletion process
      console.error('Error deleting item from database:', error.message)
    })
    // Construct the update object with the data to be updated 
    const deleteBox = {}
    // Add the new data (newBox) to the update object under the item's key
    deleteBox[box.getKey()] = null

    // Use the firebase update predefined functions to commit the changes to the database.
    // Pass in the reference to the database and the update object (editBox) containing the new data.
    await update(getItemsDatabaseReference(), deleteBox)

  } catch (error) {
    // Log any errors that occur during the deletion process
    console.error('Error deleting item from database:', error.message)
    // Optionally, you can throw the error to handle it further up the call stack
    throw error
  }
}

// Define the custom component 
customElements.define('custom-gallery-component', Component)