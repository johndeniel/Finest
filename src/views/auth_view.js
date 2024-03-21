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

function handleGoogleLoginButtonClick(event) {
  const button = event.target.closest('.google-login-button')
  if (button) {
    try {
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider)
        .then(() => {
          window.location.href = '/'
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error)
        })
    } catch (error) {
      console.error('Error in handleGoogleSignInResult:', error)
    }
  }
}

export default renderAuth 