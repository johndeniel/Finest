import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../utils/firebase/database'

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
function handleGoogleLoginButtonClick(event) {
  // Check if the clicked element is the Google login button
  const button = event.target.closest('.google-login-button')
  if (button) {

    try {
      // Initialize GoogleAuthProvider for authentication
      const provider = new GoogleAuthProvider()

      // Sign in with Google using a popup
      signInWithPopup(auth, provider)

        // Redirect to the home page after successful sign-in
        .then(() => {
          window.location.href = '/'
        })

        // Log and handle errors during Google sign-in
        .catch((error) => {
          console.error('Error signing in with Google:', error)
        })

    } catch (error) {
      // Log any unexpected errors during the sign-in process
      console.error('Error in handleGoogleSignInResult:', error)
    }
  }
}

export default renderAuth 