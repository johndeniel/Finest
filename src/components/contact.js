// Overview:
// This script focuses on creating a ContactListComponent, which is a custom HTML element designed for web applications. The primary purpose of this component is to manage and display contacts associated with the currently signed-in user. The script integrates with Firebase Firestore for database operations, including fetching contacts, chatrooms, and associated users.

// Key Components:
// 1. ContactListComponent: This custom HTML element encapsulates the functionality related to managing and displaying contacts. It is added to the DOM and dynamically renders contact cards based on fetched data.
// 2. Firebase Integration: The script leverages Firebase for real-time data storage and retrieval. It uses Firebase Firestore to query and retrieve contact information, chatroom data, and user details.
// 3. Fetching Contacts: The script includes asynchronous functions to fetch contacts associated with the signed-in user. It uses Firebase queries to retrieve contact data from Firestore and processes the fetched information for rendering.
// 4. Rendering Contact Cards: Each contact is represented as a contact card within the ContactListComponent. These cards typically include the contact's avatar, full name, and interactive elements for actions like opening a chat or profile.
// 5. Error Handling: The script incorporates error handling mechanisms to log and manage errors during data fetching and rendering. It throws specific error messages to indicate failures in fetching contacts or related data.

// Functionality Flow:
// - The ContactListComponent is initialized and added to the DOM when the web application loads.
// - Upon initialization, the component triggers asynchronous functions to fetch contacts associated with the signed-in user.
// - The fetched contact data is processed and rendered as contact cards within the ContactListComponent.
// - Each contact card includes interactive elements like avatars, full names, and click events for actions such as opening chats or profiles.
// - Firebase Firestore queries are used to fetch additional data, such as chatrooms and users associated with those chatrooms, enhancing the functionality for communication and interaction within the application.

// Use Cases:
// - User Management: The ContactListComponent facilitates the management of user contacts, allowing users to view and interact with their contacts within the application.
// - Communication Features: Integration with chatrooms and user data enhances communication features by providing seamless access to chat functionalities and user profiles.
// - Real-Time Updates: Leveraging Firebase Firestore enables real-time updates to contact information, ensuring that the contact list remains up-to-date with the latest data.

// Overall, this script plays a crucial role in creating a user-friendly interface for managing contacts and facilitating communication within the web application, enhancing the overall user experience.




import { auth, allChatroomCollectionReference, getOtherUserFromChatroom } from '../utils/firebase/database'
import { query, where, getDocs, getDoc } from 'firebase/firestore'
import { Chatroom } from '../utils/models/chatroom'
import { UserModel } from '../utils/models/user'

class Component extends HTMLElement {
  constructor() {
    super()
  }

  // Lifecycle method called when the component is added to the DOM
  async connectedCallback() {
    try {
      // Define HTML content for the contact list
      const htmlContent = /*html*/ `
        <div class="contact-list">
        </div>
      `
      
      // Call the script function to handle authentication state and data fetching
      await script()

      // Set the HTML content directly to the component
      this.innerHTML = htmlContent

    } catch (error) {
      // Log an error message if there is an issue rendering the contact list due to a failure in fetching contacts.
      console.error('Error rendering contact list. Failed to fetch contacts in ContactListComponent class:', error)

      // Throw a new Error with a specific message for failed contact fetching.
      throw new Error('Failed to fetch contacts. Please try again later.')
    }
  }
}



// Asynchronously fetches the contacts associated with the currently signed-in user and renders them.
async function script() {
  try {
    // Listen for changes in the authentication state and execute the callback when the state changes.
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Chain of promises to fetch chatrooms for the user,
        const chatrooms = await fetchUserChatrooms(user)

        // then fetch users associated with those chatrooms,
        const users = await fetchUsersInChatrooms(user, chatrooms)

        // Call the renderContacts function with the fetched users
        renderContacts(users)

      } else {
        // Log an error if no user is signed in
        console.error('No user is signed-in in fetchContacts function.')

        // Redirect to the authentication page
        window.location.href = '/#/auth'
      }
    })

  } catch (error) {
    // Log and handle the error
    console.error('Error fetching and rendering contacts:', error)

    // Handle the error, such as logging or displaying an error message to the user.
    throw new Error('Failed to fetch chatrooms. Please try again later.')
  }
}



// Fetches chatrooms for a specified user.
async function fetchUserChatrooms(user) {
  try {
    // Validate if the user object exists
    if (!user) {
      // Log an error message if the user object is missing
      console.error('Error: User is required in fetchUserChatrooms function.')
    }

    // Initialize an empty array to store Chatroom objects fetched for the specified user.
    const chatrooms = []

    // Creates a Firestore query to retrieve chatrooms where the user's ID is present in the 'userIds' array.
    const chatroomsQuery = query(allChatroomCollectionReference(), where('userIds', 'array-contains', user.uid))

    // Retrieves chatrooms data based on the Firestore query snapshot.
    const querySnapshot = await getDocs(chatroomsQuery)

    // Iterate through each document snapshot in the Firestore query snapshot to create Chatroom objects.
    querySnapshot.forEach(snapshot => {
      
      // Check if the snapshot exists in the Firestore query snapshot before processing its data.
      if (snapshot.exists()) {
        // Extract chatroom data from the document snapshot.
        const chatroomData = snapshot.data()

        // Create a new Chatroom instance using the extracted data.
        const chatroom = new Chatroom(
          snapshot.id,
          chatroomData.userIds,
          chatroomData.lastMessageTimestamp,
          chatroomData.lastMessageSenderId,
          chatroomData.lastMessage
        )

        // Add the created Chatroom object to the chatrooms array.
        chatrooms.push(chatroom)

      } else {
        // Log an error message if the chatroom document does not exist.
        console.error('Error: Chatroom document does not exist in fetchUserChatrooms function')
      }
    })

    // Return the array of Chatroom objects fetched for the specified user.
    return chatrooms

  } catch (error) {
    // Log an error message to the console if there's an error fetching chatrooms.
    console.error('Error fetching chatrooms in fetchUserChatrooms function:', error)
    
    // Handle the error, such as logging or displaying an error message to the user.
    throw new Error('Failed to fetch chatrooms. Please try again later.')
  }
}



// Fetches users associated with chatrooms.
async function fetchUsersInChatrooms(user, chatrooms) {
  try {
    // Validate if the chatrooms object exists
    if(!chatrooms) {
      // Log an error message if the chatrooms object is missing
      console.error('Error: chatrooms is required in fetchUsersInChatrooms function.')
    }

    // Initialize an empty array to store User objects.
    const users = []

    // Map each chatroom to its corresponding user document reference using getOtherUserFromChatroom function.
    const userDocumentRefs = chatrooms.map(chatroom => getOtherUserFromChatroom(user.uid, chatroom.getUserIds()))

    // Retrieve user document snapshots for all user document references in parallel using Promise.all.
    const userSnapshots = await Promise.all(userDocumentRefs.map(ref => getDoc(ref)))
    
    // Iterate through each document snapshot in the Firestore query snapshot to process user data.
    userSnapshots.forEach(snapshot => {
      // Check if the snapshot exists and contains data
      if (snapshot.exists()) {
        // Extract user data from the document snapshot.
        const userDataSnapshot = snapshot.data()

        // Create a new UserModel instance using the extracted user data.
        const user = new UserModel(
          snapshot.id,
          userDataSnapshot.fullName,
          userDataSnapshot.avatar
        )

        // Add the created UserModel object to the users array.
        users.push(user)

      } else {
        // Log an error message if the user document does not exist.
        console.error('Error: User document does not exist in fetchUsersInChatrooms function')
      }
    })

    // Return the array of User objects fetched for the specified chatrooms.
    return users
    
  } catch (error) {
    // Log an error message if there's an error fetching users in chatrooms.
    console.error('Error fetching users in chatrooms in fetchUsersInChatrooms function:', error)
    
    // Throw a new Error with a specific message for failed user fetching.
    throw new Error('Failed to fetch users. Please try again later.')
  }
}



// Function to render contacts in the contact list container
function renderContacts(contacts) {
  try {
    // Validate if the contacts object exists
    if(!contacts) {
      // Log an error message if the chatrooms object is missing
      console.error('Error: chatrooms is required in renderContacts function.')
    }

    // Get the container for the contact list
    const contactListContainer = document.querySelector('.contact-list')

    // Clear any existing content in the container
    contactListContainer.innerHTML = ''

    // Iterate through the contacts array to create a contact card for each contact.
    contacts.forEach(contact => {
      // Create a new div element for the contact card.
      const contactCard = document.createElement('div')
      contactCard.classList.add('contact-card')

      // Create an img element for the contact's avatar and set its source.
      const contactAvatar = document.createElement('img')
      contactAvatar.src = contact.getAvatar()
      contactAvatar.classList.add('contact-avatar')

      // Add tooltip for the contact's full name on hover.
      contactCard.title = contact.getFullName()

      // Add a click event listener to the contact card to trigger an action with the contact's ID.
      contactCard.addEventListener('click', () => {
        // Perform an action with the contact's ID, such as opening a chat or profile.
        document.location.hash = `/chat/${contact.getId()}`
      })

      // Append the contact's avatar to the contact card.
      contactCard.appendChild(contactAvatar)

      // Append the contact card to the contact list container.
      contactListContainer.appendChild(contactCard)
    })

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error rendering contacts in renderContacts function:', error)

    // Throw a new Error with a specific message for failed user fetching.
    throw new Error('Failed to fetch users. Please try again later.')
  }
}


// Define the custom component
customElements.define('custom-contact-list-component', Component)