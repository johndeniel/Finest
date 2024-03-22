// Import necessary functions and classes
import { auth, getNowTimeStamp, getChatroomMessageReference, getChatroomReference } from '../utils/firebase/database'
import { Chatroom } from '../utils/models/chatroom.js'
import { parseRequestUrl } from '../utils/parser.js'
import { query, orderBy, getDoc } from 'firebase/firestore'

class CustomChatElement extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    try {
      // Define HTML content for the chat component
      const htmlContent = /*html*/ `
        <h1>Chat</h1>
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

// Define the fetchChat function
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

async function handleSetupChatroom() {
  try {
    const chatRoomId = getChatroomId(currentUserUuid, recipientUuid)
    handleSetupChatRecyclerView(chatRoomId)
    const chatroomRef = getChatroomReference(chatRoomId)

    console.log(chatRoomId)
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

async function handleSetupChatRecyclerView(chatroomId) {
  const chatroomsQuery = query(getChatroomMessageReference(chatroomId), orderBy('timestamp', 'desc'))
  console.log(chatroomsQuery)
}

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

function getChatroomId(currentUserUuid, recipientUuid) {
  return currentUserUuid < recipientUuid ? `${currentUserUuid}_${recipientUuid}` : `${recipientUuid}_${currentUserUuid}`
}

// Define the custom element for Chat
customElements.define('custom-chat-element', CustomChatElement)