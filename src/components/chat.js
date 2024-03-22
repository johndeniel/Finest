// Import necessary functions and classes
import { auth, getNowTimeStamp, getChatroomMessageReference, getChatroomReference } from '../utils/firebase/database'
import { Chatroom } from '../utils/models/chatroom.js'
import { parseRequestUrl } from '../utils/parser.js'
import { query, orderBy, getDoc, getDocs } from 'firebase/firestore'
import { ConversationModel } from '../utils/models/conversation.js'

class CustomChatElement extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    try {
      // Define HTML content for the chat component
      const htmlContent = /*html*/ `
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

let chatroom
let recipientUuid
let currentUserUuid

// Define the fetchChat function to fetch chat data
async function fetchChat() {
  auth.onAuthStateChanged(async (user) => {
    try {
      if (user) {
        currentUserUuid = user.uid

        let request = parseRequestUrl() 
        recipientUuid = request.id

        await handleSetupChatroom()
      } else {
        console.log('User is not authenticated')
      }
    } catch (error) {
      console.error('Error in auth state change:', error)
    }
  })
}

// Handle the setup of the chatroom
async function handleSetupChatroom() {
  try {
    const chatRoomId = getChatroomId(currentUserUuid, recipientUuid)
    handleSetupChatRecyclerView(chatRoomId)
    const chatroomRef = getChatroomReference(chatRoomId)

    const doc = await getDoc(chatroomRef)
    if (doc.exists) {
      chatroom = new Chatroom(
        doc.data().chatroomId,
        doc.data().userIds,
        doc.data().lastMessageTimestamp,
        doc.data().lastMessageSenderId,
        doc.data().lastMessage
      )
    }

    if (!chatroom) {
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
  const messages = []

  messageSnapshot.forEach(doc => {
    const messageData = doc.data()
    const message = new ConversationModel(
      messageData.message,
      messageData.senderId,
      messageData.timestamp,
    )
    messages.push(message)
  })

  console.log(messages)



  // Render messages
  const chatContainer = document.querySelector('.chat-container')
  messages.forEach(message => {
    const chatHolder = document.createElement('div')
    chatHolder.classList.add('chat-holder')

    if (message.getSenderId() === 'RZCVBq2uI6SErP4BUcC0qS8G4Az2') {
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

function convertTimestampToDateString(timestamp) {
  // Convert Firebase Firestore Timestamp to JavaScript Date object
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)

  // Format the date as desired (e.g., MM/DD/YYYY HH:MM:SS)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

  return formattedDate
}

// Define the custom element for Chat
customElements.define('custom-chat-element', CustomChatElement)
