import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth' 
import {auth} from '../Utils/Database/FirebaseInitialization'

// Google Sign-In button
const signInButton = document.getElementById('google-login-button')
signInButton.addEventListener('click', handleGoogleSignInResult)

// Define the handleGoogleSignInResult function
function handleGoogleSignInResult() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}