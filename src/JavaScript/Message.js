import { auth, allChatroomCollectionReference, getOtherUserFromChatroom } from '../Utils/Database/FirebaseInitialization'
import { query, where, getDoc, getDocs } from 'firebase/firestore'
import { Chatroom } from '../Utils/Model/Chatroom'
import { User } from '../Utils/Model/User' 

const chatroomList = []
const listOfUserDocumentReference = [] 
const listOfUserInformation = []

/* run main */ main() 

function main() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      const chatroomsQuery = query(allChatroomCollectionReference(), where('userIds', 'array-contains', user.uid))
      getDocs(chatroomsQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const chatroomData = doc.data()
            const chatroom = new Chatroom(
              doc.id,
              chatroomData.userIds,
              chatroomData.lastMessageTimestamp,
              chatroomData.lastMessageSenderId,
              chatroomData.lastMessage
            )
            chatroomList.push(chatroom)
          })
  
          handleUsersInsideChatroom()
          handleUserInformation()
        })
        .catch((error) => {
          console.error('Error retrieving chatrooms:', error)
        })
    } else {
      console.log('No user is signed in.')
    }
  })
}

/**
 * Populate the list of user document references from chatroom user IDs.
 */
async function handleUsersInsideChatroom() {
  try {
    // Iterate through each chatroom in the list
    for (const chatroom of chatroomList) {
      // Get the user document reference from the chatroom
      const userRef = getOtherUserFromChatroom(chatroom.getUserIds())
      // Push the user document reference to the list
      listOfUserDocumentReference.push(userRef)
    }
    console.log('User document references populated successfully')
  } catch (error) {
    console.error('An error occurred while populating user document references:', error)
  }
}


async function handleUserInformation() {
  try {
    for (const ref of listOfUserDocumentReference) {
      const snapshot = await getDoc(ref)
      if (snapshot.exists()) {
        const userData = snapshot.data()
        const user = new User(
          snapshot.id,
          userData.fullName,
          userData.avatar
        )
        listOfUserInformation.push(user)
      } else {
        console.log('User document does not exist')
      }
    }
  } catch (error) {
    console.error('Error retrieving user information:', error)
  }
  console.log(listOfUserInformation)
  handleChatAvatar() 
}

function handleChatAvatar() {
  const contactsList = document.querySelector('.contacts')

  listOfUserInformation.forEach(chatmate => {
    const chatCard = document.createElement('div')
    chatCard.classList.add('chat-card')

    const chatAvatar = document.createElement('img')
    chatAvatar.src = chatmate.getAvatar()
    chatAvatar.classList.add('chat-avatar')

    // Add tooltip for full name on hover
    chatCard.title = chatmate.getFullName()

    // Add click event listener to trigger alert with ID
    chatCard.addEventListener('click', () => {
      alert(`ID: ${chatmate.getId()}`)
    })

    chatCard.appendChild(chatAvatar)
    contactsList.appendChild(chatCard)
  })
}
