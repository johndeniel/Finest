import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../utils/firebase/database'

export default function renderAuth() {
  
  const htmlContent = /*html*/ `
    <h1>Authentication</h1>
    <button class="google-login-button">Sign in with Google</button>
  `
  // Add event listener for the button click using the imported function
  document.addEventListener('click', handleGoogleLoginButtonClick)

  return htmlContent
} 

function handleGoogleLoginButtonClick(event) {
  const button = event.target.closest('.google-login-button')
  if (button) {
    try {
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider)
        .then(() => {
          // Redirect to Home.html after successful authentication
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error)
        })
    } catch (error) {
      console.error('Error in handleGoogleSignInResult:', error)
    }
  }
}