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


const navLinks = document.querySelector('.navigation') 
const navItemsData = [
  { iconClass: 'fi fi-rr-home', 
    text: 'Home' 
  },
  { iconClass: 'fi fi-rr-user', 
    text: 'My Profile' 
  },
  { iconClass: 'fi fi-rr-bookmark', 
    text: 'Saves' 
  },
  { iconClass: 'fi fi-rr-settings', 
    text: 'Settings' 
  }
]

navItemsData.forEach(nav => {                     // Loop through each item in the navItemsData array
  const holder = document.createElement('div')    // Create a div element to hold each navigation item
  holder.classList.add('aside-nav')               // Add the 'aside-nav' class to the holder div

  const navIcon = document.createElement('i')     // Create an icon element for the navigation item
  navIcon.className = nav.iconClass               // Set the class of the icon element

  const navTitle = document.createElement('p')    // Create a paragraph element for the navigation item text
  navTitle.textContent = nav.text                 // Set the text content of the paragraph element

  holder.appendChild(navIcon)                     // Append the icon and text elements to the holder div
  holder.appendChild(navTitle)

  navLinks.appendChild(holder)                    // Append the holder div to the navigation container (navLinks)
})

navLinks.addEventListener('click', function(event) {            // Add event listener to the navigation container
  if (event.target.classList.contains('aside-nav')) {           // Check if the clicked element is a navigation item with the class 'aside-nav'
    const text = event.target.querySelector('p').textContent    // Get the text content of the clicked navigation item
    alert('Clicked on: ' + text)                                // Handle the click event, for example:
  }
})


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