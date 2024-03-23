// Overview:
// This script focuses on creating a CustomChatElement, a custom HTML element designed for chat interfaces in web applications. The primary functionality includes fetching chat-related data, rendering chat messages, and setting up chatrooms for communication between users. The script integrates with Firebase Firestore for real-time data storage and retrieval, including user information, chat messages, and chatroom setup.

// Key Components:
// 1. CustomChatElement: This custom HTML element encapsulates the chat interface functionality, including rendering user information, fetching chat messages, and setting up chatrooms.
// 2. Firebase Integration: The script leverages Firebase Firestore for data operations, such as fetching user details, retrieving chat messages, and managing chatrooms.
// 3. Fetching Chat Data: Asynchronously fetches chat-related data, including user information and chat messages, to populate the chat interface.
// 4. Rendering Chat Messages: Dynamically renders chat messages within the chat container based on fetched data and current user interactions.
// 5. Chatroom Setup: Handles the setup of chatrooms for communication between users, including creation if needed and fetching existing chat messages.

// Functionality Flow:
// - CustomChatElement is initialized and added to the DOM when the web application loads.
// - Upon initialization, the component triggers asynchronous functions to fetch chat-related data and set up the chat interface.
// - User authentication is checked to determine the current user's identity and fetch relevant data.
// - User information, including avatar and name, is rendered in the chat interface for communication context.
// - Chatroom setup includes creating new chatrooms if necessary and fetching existing chat messages for display.
// - Chat messages are rendered in real-time within the chat container, providing a seamless chat experience.

// Use Cases:
// - Real-Time Chat: Facilitates real-time chat functionality between users within the web application.
// - User Interaction: Enhances user interaction by displaying user information and chat messages dynamically.
// - Chatroom Management: Manages chatroom setup and message retrieval for effective communication.

// Overall, this script plays a vital role in creating an interactive and real-time chat experience within web applications, enhancing communication and user engagement.




import { auth, getNowTimeStamp, getChatroomMessageReference, getChatroomReference, allUserCollectionReference } from '../utils/firebase/database'
import { Chatroom } from '../utils/models/chatroom.js'
import { parseRequestUrl } from '../utils/parser.js'
import { query, orderBy, getDoc, getDocs } from 'firebase/firestore'
import { ConversationModel } from '../utils/models/conversation.js'
import { UserModel } from '../utils/models/user.js'


// Define the CustomChatElement component as a custom HTML element
class Component extends HTMLElement {
  constructor() {
    super()
  }

  // Lifecycle method called when the component is added to the DOM
  async connectedCallback() {
    try {
      // Define HTML content for the chat component
      const htmlContent = /*html*/ `
        <div class="chat-avatar-container">
          <img class="chat-avatar-img" src="" alt="Avatar">
          <span class="chat-avatar-name"></span>
        </div>

        <div class="chat-message-container">
          <!-- Messages will be rendered here -->
        </div>
      `
      
      // Fetch chat data asynchronously
      await fetchChat()

      // Set the HTML content directly to the component
      this.innerHTML = htmlContent

    } catch (error) {
      // Log an error message if there is an issue rendering the chat component
      console.error('Error rendering chat component in connectedCallback:', error)

      // Throw a new Error with a specific message for failed chat component rendering
      throw new Error('Failed to render the chat component. Please refresh the page.')
    }
  }
}



// Asynchronously fetches chat-related data and sets up the chat interface.
async function fetchChat() {
  try {
    // Listen for changes in authentication state
    auth.onAuthStateChanged(async (user) => {
      // Parse the request URL to get recipient information
      let request = parseRequestUrl() 

      if (user) {
        // Get the current user's UUID
        let currentUserUuid = user.uid

        // Extract the recipient's UUID from the request
        let recipientUuid = request.id

        // Display recipient's information in the UI
        await renderUserChatHead(recipientUuid) 

        // Set up the chatroom for communication
        await setupChatroom(currentUserUuid, recipientUuid)

      } else {
        // Log a message if the user is not authenticated
        console.log('User is not authenticated in fetchChat function')

        // Redirect to the authentication page
        window.location.href = '/#/auth'
      }
    })

  } catch (error) {
    // Log an error message for the catch block
    console.error('Error in auth state change in fetchChat function:', error)

    // Throw a new Error with a specific message for failed chat fetching
    throw new Error('Failed to fetch chat data. Please try again later.')
  }
}



// Display user information with recipient's avatar and name
async function renderUserChatHead(recipientUuid) {
  try {
    // Validate recipientUuid
    if (!recipientUuid) {
      console.log('Recipient UUID is required in renderUserChatHead function.')
    }

    // Get the reference to the user document in Firestore
    const userDocumentRef = allUserCollectionReference(recipientUuid)

    // Fetch the user document snapshot
    const docSnap = await getDoc(userDocumentRef)

    // Check if the user document exists
    if (docSnap.exists()) {
      // Extract user data from the document snapshot
      const userData = docSnap.data()

      // Create a new UserModel instance
      const user = new UserModel(
        docSnap.id,
        userData.fullName,
        userData.avatar
      )

      // Select the avatar image and name elements in the DOM
      const avatarImg = document.querySelector('.chat-avatar-img')
      const avatarName = document.querySelector('.chat-avatar-name')

      // Set the source of the avatar image and text content of the avatar name to user data
      avatarImg.src = user.getAvatar()
      avatarName.textContent = user.getFullName()

    } else {
      // Log a message if the document doesn't exist
      console.log('No such document in renderUserChatHead function')
    }

  } catch (error) {
    // Log an error message if there's an error fetching the user document
    console.error('Error fetching user document in renderUserChatHead function:', error)

    // Throw a new Error with a specific message for failed chatroom setup
    throw new Error('Failed to set up the chatroom. Please try again later.')
  }
}



// Handle the setup of the chatroom, including validation and creation if needed
async function setupChatroom(currentUserUuid, recipientUuid) {
  try {
    // Validate currentUserUuid
    if (!currentUserUuid) {
      console.error('currentUserUuid is required in setupChatroom function.')
    }

    // Validate recipientUuid
    if (!recipientUuid) {
      console.error('recipientUuid is required in setupChatroom function.')
    }

    // Generate chatRoomId based on user IDs
    const chatRoomId = generateChatroomId(currentUserUuid, recipientUuid)

    // Get the reference to the chatroom in Firestore
    const chatroomRef = getChatroomReference(chatRoomId)

    // Check if the chatroom already exists
    const doc = await getDoc(chatroomRef)

    // Check if the chatroom document does not exist in Firestore
    if (!doc.exists) {
      // Create a new chatroom if it doesn't exist in Firestore
      await createNewChatroom(chatRoomId, currentUserUuid, recipientUuid)
    }

    // Fetch chat messages asynchronously using currentUserUuid and chatRoomId
    const messages = await  fetchChatMessages(currentUserUuid, chatRoomId)

    // Render the fetched messages in the chat interface for currentUserUuid
    renderChatMessages(currentUserUuid, messages)

  } catch (error) {
    // Log an error message if there's an error setting up the chatroom.
    console.error('Error setting up the chatroom in setupChatroom function:', error)

    // Throw a new Error with a specific message for failed chatroom setup.
    throw new Error('Failed to set up the chatroom. Please try again later.')
  }
}



// Fetches and processes chat messages from Firestore for display.
async function fetchChatMessages(currentUserUuid, chatroomId) {
  try{
    // Validate currentUserUuid
    if (!currentUserUuid) {
      console.error('Current user UUID is required and cannot be empty in fetchChatMessages function.')
    }

    // Validate chatroomId
    if (!chatroomId) {
      console.error('Chatroom ID is required and cannot be empty in fetchChatMessages function.')
    }

    // Initialize an array to store the message objects
    const messages = []

    // Query the chatroom messages from Firestore and order them by timestamp in ascending order
    const messagesQuerySnapshot = query(getChatroomMessageReference(chatroomId), orderBy('timestamp', 'asc'))

    // Retrieve the documents from the query snapshot
    const messageDocsSnapshot = await getDocs(messagesQuerySnapshot)
    
    // Iterate through each document snapshot in the messages query snapshot
    messageDocsSnapshot.forEach(snapshot => {
      // Check if the snapshot exists and contains data
      if (snapshot.exists()) {
        // Extract message data from the current document snapshot
        const messageSnapshotData = snapshot.data()

        // Create a new ConversationModel instance using data from the message snapshot
        const message = new ConversationModel(
          messageSnapshotData.message,
          messageSnapshotData.senderId,
          messageSnapshotData.timestamp,
        )

        // Add the newly created message to the messages array
        messages.push(message)

      } else {
        // Log an error message if the document doesn't exist
        console.error('Error: Document does not exist in fetchChatMessages function')
      }
    })

    // Return the array of messages retrieved from Firestore
    return messages
    
  } catch (error) {
    // Log an error message if there's an error fetching messages in chatrooms.
    console.error('Error fetching messages in chatrooms in fetchChatMessages function:', error)
    
    // Throw a new Error with a specific message for failed message fetching.
    throw new Error('Failed to fetch messages. Please try again later.')
  } 
}



// Render chat messages in the chat container based on the current user and message data.
async function renderChatMessages(currentUserUuid, messages) {
  try {
    // Check if currentUserUuid is not provided
    if(!currentUserUuid){
      console.error('currentUserUuid is required in renderChatMessages function.')
    }

    // Check if the messages array is not null before proceeding with rendering
    if (!messages) {
      console.error('Error: Messages array is null in renderChatMessages function.')
    }

    // Get the chat container element
    const chatContainer = document.querySelector('.chat-message-container')

    // Iterate through each message and create a chat holder element
    messages.forEach(message => {
      // Create a new div element to hold a chat message
      const chatHolder = document.createElement('div')
      chatHolder.classList.add('chat-message-holder')

      // Add a CSS class based on the sender's ID for styling
      if (message.getSenderId() === currentUserUuid) {
        // If the sender is the current user, add a CSS class for right-aligned chat styling
        chatHolder.classList.add('chat-message-right-holder')
      } else {
        // If the sender is not the current user, add a CSS class for left-aligned chat styling
        chatHolder.classList.add('chat-message-left-holder')
      }

      // Create elements for message text
      const messageText = document.createElement('p')
      messageText.textContent = message.getMessage()
      messageText.classList.add('chat-message-text')

      // Create elements for timestamp
      const messageTimestamp = document.createElement('span')
      messageTimestamp.textContent = convertTimestampToDateString(message.getTimestamp())
      messageTimestamp.classList.add('chat-message-timestamp')

      // Append message text and timestamp to the chat holder
      chatHolder.appendChild(messageText)
      chatHolder.appendChild(messageTimestamp)

      // Append the chat holder to the chat container
      chatContainer.appendChild(chatHolder)
    })

  } catch (error) {
    // Log an error message if there's an error rendering chat messages.
    console.error('Error rendering chat messages in renderChatMessages function:', error)
  
    // Throw a new Error with a specific message for failed chat message rendering.
    throw new Error('Failed to render chat messages. Please try again later.')
  }
}



// Create a new chatroom if it doesn't exist
async function createNewChatroom(chatRoomId, currentUserUuid, recipientUuid) {
  try {
    // Validate chatRoomId
    if (!chatRoomId) {
      console.error('chatRoomId is required in createNewChatroom function.')
    }

    // Validate currentUserUuid
    if (!currentUserUuid) {
      console.error('currentUserUuid is required in createNewChatroom function.')
    }

    // Validate recipientUuid
    if (!recipientUuid) {
      console.error('recipientUuid is required in createNewChatroom function.')
    }

    // Get the reference to the chatroom in Firestore
    const chatroomRef = getChatroomReference(chatRoomId)

    // Create a new Chatroom instance
    const newChatroom = new Chatroom(
      chatRoomId,
      [currentUserUuid, recipientUuid],
      getNowTimeStamp(),
      ''
    )

    // Set the new chatroom in Firestore
    await chatroomRef.set(newChatroom)
  
  } catch (error) {
    // Log an error message if there's an error creating a new chatroom.
    console.error('Error creating new chatroom in createNewChatroom function:', error)
  
    // Throw a new Error with a specific message for failed chatroom creation.
    throw new Error('Failed to create a new chatroom. Please try again later.')
  }
}



// Generate a unique chatroom ID based on user IDs
function generateChatroomId(currentUserUuid, recipientUuid) {
  // Concatenate the user IDs to create a chatroom ID, ensuring consistency regardless of order
  return currentUserUuid < recipientUuid ? `${currentUserUuid}_${recipientUuid}` : `${recipientUuid}_${currentUserUuid}`
}

// Convert timestamp to formatted date string
function convertTimestampToDateString(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  return formattedDate
}

// Define the custom component
customElements.define('custom-chat-component', Component)