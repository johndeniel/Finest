// Import necessary functions and classes
import { auth, allChatroomCollectionReference, getOtherUserFromChatroom } from '../utils/firebase/database'
import { query, where, getDocs, getDoc } from 'firebase/firestore'
import { Chatroom } from '../utils/models/chatroom'
import { User } from '../utils/models/user'

// Define the ContactList component
class ContactList extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    try {
      // Define HTML content for the contact list
      const htmlContent = /*html*/ `
        <div class="contact-list">
        </div>
      `

      // Get contacts asynchronously
      const listOfContacts = await getContacts()

      // Set the HTML content directly to the component
      this.innerHTML = htmlContent

      // Get the container for the contact list
      const contactListContainer = this.querySelector('.contact-list')

      // Create contact cards for each contact
      listOfContacts.forEach(contact => {
        const contactCard = document.createElement('div')
        contactCard.classList.add('contact-card')

        const contactAvatar = document.createElement('img')
        contactAvatar.src = contact.getAvatar()
        contactAvatar.classList.add('contact-avatar')

        // Add tooltip for full name on hover
        contactCard.title = contact.getFullName()

        // Add click event listener to trigger action with contact ID
        contactCard.addEventListener('click', () => {
          // Perform action with contact ID, e.g., open chat or profile
          console.log(`Contact ID: ${contact.getId()}`)
        })

        contactCard.appendChild(contactAvatar)
        contactListContainer.appendChild(contactCard)
      })
    } catch (error) {
      console.error('Error rendering contact list:', error)
    }
  }
}

// Define the getContacts function
async function getContacts() {
  const user = auth.currentUser
  if (!user) {
    throw new Error('No user is signed in.')
  }

  // Get chatrooms for the user
  const chatrooms = await getChatrooms(user)
  // Get users in the chatrooms
  const users = await getUsersInChatrooms(chatrooms)
  return users
}

// Get chatrooms for a user
async function getChatrooms(user) {
  const chatroomsQuery = query(allChatroomCollectionReference(), where('userIds', 'array-contains', user.uid))
  const querySnapshot = await getDocs(chatroomsQuery)
  const chatrooms = []

  querySnapshot.forEach(doc => {
    const chatroomData = doc.data()
    const chatroom = new Chatroom(
      doc.id,
      chatroomData.userIds,
      chatroomData.lastMessageTimestamp,
      chatroomData.lastMessageSenderId,
      chatroomData.lastMessage
    )
    chatrooms.push(chatroom)
  })

  return chatrooms
}

// Get users in chatrooms
async function getUsersInChatrooms(chatrooms) {
  const userRefs = chatrooms.map(chatroom => getOtherUserFromChatroom(chatroom.getUserIds()))
  const snapshots = await Promise.all(userRefs.map(ref => getDoc(ref)))
  const users = []

  snapshots.forEach(snapshot => {
    if (snapshot.exists()) {
      const userData = snapshot.data()
      const user = new User(
        snapshot.id,
        userData.fullName,
        userData.avatar
      )
      users.push(user)
    } else {
      console.log('User document does not exist')
    }
  })

  return users
}

// Define the custom element for ContactList
customElements.define('contact-list', ContactList)