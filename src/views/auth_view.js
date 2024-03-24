import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../utils/firebase/database'
import { allUserCollectionReference } from '../utils/firebase/database'
import { setDoc } from 'firebase/firestore'

const renderAuth = {
  render: async () => {
    // Add event listener for the button click inside the render method
    document.addEventListener('click', handleGoogleLoginButtonClick)

    return /*html*/ ` 
      <h1>Authentication</h1>
      <button class="google-login-button">Sign in with Google</button>
    `
  },
}


// Function to handle Google login button click event
async function handleGoogleLoginButtonClick(event) {
  // Check if the clicked element is the Google login button
  const button = event.target.closest('.google-login-button')

  // Check if the button variable is not null or undefined
  if (button) {
    try {
      // Initialize GoogleAuthProvider for authentication
      const provider = new GoogleAuthProvider()

      // Sign in with Google using a popup
      signInWithPopup(auth, provider)

        // Handle the user credential returned from Google sign-in
        .then(async (userCredential) => {
          // Extract the user information from the user credential
          const user = userCredential.user

          // Extract user data from the authentication result
          const id = user.uid
          const fullName = user.displayName
          const avatar = user.photoURL

          // Collect user data and store it in the database
          await collectUserData(id, fullName, avatar)
  
          // Redirect to the home page
          window.location.href = '/'
        })

        // Log and handle errors during Google sign-in
        .catch((error) => {
          console.error('Error signing in with Google in handleGoogleLoginButtonClick function:', error)
        })

    } catch (error) {
      // Log any unexpected errors during the sign-in process
      console.error('Error in handleGoogleSignInResult:', error)

      // Throw a new Error with a specific message for failed chatroom setup
      throw new Error('Failed to sign in with Google. Please try again later.')
    }

  } else {
    // Log any unexpected errors during the sign-in process
    console.error('Error: Google login button not found.')
  }
}



// Collects user data and stores it in the Firestore collection.
async function collectUserData(id, fullName, avatar) {
  try {
    // Validate user id
    if (!id) {
      console.log('User ID is required.')
    }

    // Validate user fullName
    if (!fullName) {
      console.log('Full name is required.')
    }

    // Validate user avatar
    if (!avatar) {
      console.log('Avatar URL is required.')
    }

    // Add user data to Firestore collection
    await setDoc(allUserCollectionReference(id), {
      id: id, 
      fullName: fullName, 
      avatar: avatar
    })
  
  } catch (error) {
    // Log any unexpected errors during the user data collection process
    console.error('Error adding user data:', error.message)

    // Throw a new Error with a specific message for failed user data collection
    throw new Error('Failed to add user data. Please try again later.')
  }
}


export default renderAuth 