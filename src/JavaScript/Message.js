import { auth, allChatrooms } from '../Utils/Database/FirebaseInitialization'
import { query, where, getDocs } from 'firebase/firestore'
import { Chatroom } from '../Utils/Model/Chatroom'

const chatroomList = []

// Listen for authentication state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    // Query chatrooms where the user is a member
    const chatroomsQuery = query(allChatrooms(), where('userIds', 'array-contains', user.uid))
    // Retrieve chatroom documents
    getDocs(chatroomsQuery)
      .then((querySnapshot) => {
        // Iterate through each chatroom document
        querySnapshot.forEach((doc) => {
          // Extract chatroom data
          const chatroomData = doc.data()

          // Create a new Chatroom object
          const chatroom = new Chatroom(
            doc.id,
            chatroomData.userIds,
            chatroomData.lastMessageTimestamp,
            chatroomData.lastMessageSenderId,
            chatroomData.lastMessage
          )
          // Add the chatroom to the list
          chatroomList.push(chatroom)
        })
      })
      .catch((error) => {
        console.error('Error retrieving chatrooms:', error)
      })
  } else {
    console.log('No user is signed in.')
  }
})

console.log(chatroomList)




const contactsList = document.querySelector('.contacts')
const chatmates = [
  {
    name: 'John Doe 1',
    profileImage: 'https://cdn.britannica.com/87/2087-004-264616BB/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg',
  },
  {
    name: 'John Doe 2',
    profileImage: 'https://cdn.britannica.com/87/2087-004-264616BB/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg',
  },
  {
    name: 'John Doe 3',
    profileImage: 'https://cdn.britannica.com/87/2087-004-264616BB/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg',
  }
]

chatmates.forEach(chatmate => {                   // Loop through each chatmate in the chatmates array
  const chatCard = document.createElement('div')  // Create a div element to represent each chat card
  chatCard.classList.add('chat-card')             // Add the 'chat-card' class to the chat card div

  const chatAvatar = document.createElement('img')// Create an image element for the chatmate's profile picture
  chatAvatar.src = chatmate.profileImage          // Set the source of the image to the chatmate's profile picture
  chatAvatar.classList.add('chat-avatar')         // Add the 'chat-avatar' class to the image element

  const chatName = document.createElement('span') // Create a span element for the chatmate's name
  chatName.textContent = chatmate.name            // Set the text content of the span element to the chatmate's name
  chatName.classList.add('chat-name')             // Add the 'chat-name' class to the span element

  chatCard.appendChild(chatAvatar)                // Append the profile picture and name elements to the chat card
  chatCard.appendChild(chatName)

  contactsList.appendChild(chatCard)              // Append the chat card to the contacts list
})

contactsList.addEventListener('click', function(event) {            // Add event listener to the contacts list
  if (event.target.classList.contains('chat-card')) {               // Check if the clicked element is a chat card with the class 'chat-card'
    const text = event.target.querySelector('span').textContent     // Get the text content of the clicked chat card's name
    alert('Clicked on: ' + text)                                    // Handle the click event, for example: Show an alert with the name of the clicked chatmate
  }
})