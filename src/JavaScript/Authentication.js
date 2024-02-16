import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../Utils/Database/FirebaseInitialization'

// Google Sign-In button
const signInButton = document.getElementById('google-login-button')
signInButton.addEventListener('click', handleGoogleSignInResult)

// Define the handleGoogleSignInResult function
function handleGoogleSignInResult() {
  try {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(() => {
        // Redirect to Home.html after successful authentication
        window.location.href = '/Home.html'
      })
      .catch((error) => {
        // Log the error to the console
        console.error('Error signing in with Google:', error)
      })
  } catch (error) {
    // Log any errors that occur during the execution of the function
    console.error('Error in handleGoogleSignInResult:', error)
  }
}