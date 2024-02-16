import { auth } from '../Utils/Database/FirebaseInitialization'

// Google Sign-Out button
const signOutButton = document.getElementById('google-logout-button')
signOutButton.addEventListener('click', handleGoogleSignOutResult)

// Define the handleGoogleSignOutResult function
function handleGoogleSignOutResult() {
  try {
    // Call the signOut() method provided by Firebase Authentication
    auth.signOut().then(function () {
      // Sign-out successful.
      window.location.href = '/Authentication.html'
      // You can redirect the user to another page or perform any other actions here after logout
    }).catch(function (error) {
      // An error occurred during sign-out.
      console.error('Error logging out:', error)
    })
  } catch (error) {
    // An error occurred while attempting to sign out the user.
    console.error('Error signing out:', error)
  }
}

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

chatmates.forEach(chatmate => {
  const chatCard = document.createElement('li')
  chatCard.classList.add('chat-card')

  const chatAvatar = document.createElement('img')
  chatAvatar.src = chatmate.profileImage
  chatAvatar.classList.add('chat-avatar')

  const chatName = document.createElement('span')
  chatName.textContent = chatmate.name
  chatName.classList.add('chat-name')

  chatCard.appendChild(chatAvatar)
  chatCard.appendChild(chatName)

  contactsList.appendChild(chatCard)
})