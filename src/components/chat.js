// Import necessary functions and classes
import { auth, getNowTimeStamp, getChatroomMessageReference, getChatroomReference, allUserCollectionReference } from '../utils/firebase/database'
import { Chatroom } from '../utils/models/chatroom.js'
import { parseRequestUrl } from '../utils/parser.js'
import { query, orderBy, getDoc, getDocs } from 'firebase/firestore'
import { ConversationModel } from '../utils/models/conversation.js'
import { UserModel } from '../utils/models/user.js'

class CustomChatElement extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    try {
      // Define HTML content for the chat component
      const htmlContent = /*html*/ `
        <div class="avatar-container">
          <img src="" alt="Avatar" class="avatar-img">
          <span class="avatar-name"></span>
        </div>

        <div class="chat-container">
          <!-- Messages will be rendered here -->
        </div>
      `

      // Fetch chat data asynchronously
      await fetchChat()

      // Set the HTML content directly to the component
      this.innerHTML = htmlContent
    } catch (error) {
      console.error('Error rendering chat component:', error)
    }
  }
}

let recipientUuid
let currentUserUuid
const messages = []

// Fetch chat data asynchronously
async function fetchChat() {
  auth.onAuthStateChanged(async (user) => {
    try {
      if (user) {
        currentUserUuid = user.uid

        let request = parseRequestUrl() 
        recipientUuid = request.id
        await setupToolBar() 
        await handleSetupChatroom()
      } else {
        console.log('User is not authenticated')
      }
    } catch (error) {
      console.error('Error in auth state change:', error)
    }
  })
}

// Setup the toolbar with recipient's avatar and name
async function setupToolBar() {
  const userDocumentRef = allUserCollectionReference(recipientUuid)

  try {
    const docSnap = await getDoc(userDocumentRef)
    if (docSnap.exists()) {
      const userData = docSnap.data()
      const user = new UserModel(
        docSnap.id,
        userData.fullName,
        userData.avatar
      )

      // Update avatar and name elements in the DOM
      const avatarImg = document.querySelector('.avatar-img')
      const avatarName = document.querySelector('.avatar-name')

      avatarImg.src = user.getAvatar()
      avatarName.textContent = user.getFullName()
    } else {
      console.log('No such document!')
    }
  } catch (error) {
    console.error('Error fetching document:', error)
  }
}

// Handle the setup of the chatroom
async function handleSetupChatroom() {
  try {
    const chatRoomId = getChatroomId(currentUserUuid, recipientUuid)
    handleSetupChatRecyclerView(chatRoomId)
    const chatroomRef = getChatroomReference(chatRoomId)

    const doc = await getDoc(chatroomRef)

    if (!doc.exists) {
      await handleCreateNewChatroom(chatRoomId, currentUserUuid, recipientUuid)
    }

  } catch (error) {
    console.error('Error handling chatroom setup:', error)
  }
}

// Setup the chat room's message view
async function handleSetupChatRecyclerView(chatroomId) {
  const querySnapshot = query(getChatroomMessageReference(chatroomId), orderBy('timestamp', 'asc'))
  const messageSnapshot = await getDocs(querySnapshot)
  
  messageSnapshot.forEach(doc => {
    const messageData = doc.data()
    const message = new ConversationModel(
      messageData.message,
      messageData.senderId,
      messageData.timestamp,
    )
    messages.push(message)
  })

  renderChat()
}

// Render messages in the chat container
async function renderChat() {
  const chatContainer = document.querySelector('.chat-container')
  messages.forEach(message => {
    const chatHolder = document.createElement('div')
    chatHolder.classList.add('chat-holder')

    if (message.getSenderId() === currentUserUuid) {
      chatHolder.classList.add('right-chat-holder')
    } else {
      chatHolder.classList.add('left-chat-holder')
    }

    const messageText = document.createElement('p')
    messageText.textContent = message.getMessage()

    const messageTimestamp = document.createElement('span')
    messageTimestamp.textContent = convertTimestampToDateString(message.getTimestamp())

    chatHolder.appendChild(messageText)
    chatHolder.appendChild(messageTimestamp)
    chatContainer.appendChild(chatHolder)
  })
}

// Create a new chatroom if it doesn't exist
async function handleCreateNewChatroom(chatRoomId, currentUserUuid, recipientUuid) {
  try {
    const chatroomRef = getChatroomReference(chatRoomId)
    const newChatroom = new Chatroom(
      chatRoomId,
      [currentUserUuid, recipientUuid],
      getNowTimeStamp(),
      ''
    )

    await chatroomRef.set(newChatroom)
    console.log('New chatroom created successfully:', chatRoomId)
  } catch (error) {
    console.error('Error creating new chatroom:', error)
  }
}

// Get the chatroom ID based on user IDs
function getChatroomId(currentUserUuid, recipientUuid) {
  return currentUserUuid < recipientUuid ? `${currentUserUuid}_${recipientUuid}` : `${recipientUuid}_${currentUserUuid}`
}

// Convert timestamp to formatted date string
function convertTimestampToDateString(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  return formattedDate
}

// Define the custom element for Chat
customElements.define('custom-chat-element', CustomChatElement)
