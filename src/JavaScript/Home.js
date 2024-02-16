import {auth} from '../Utils/Database/FirebaseInitialization'

// Google Sign-Out button
const signInButton = document.getElementById('google-logout-button')
signInButton.addEventListener('click', handleGoogleSignOutResult)

// Define the handleGoogleSignOutResult function
function handleGoogleSignOutResult() {
  try {
    // Call the signOut() method provided by Firebase Authentication
    auth.signOut().then(function() {
      // Sign-out successful.
      window.location.href = '/Authentication.html'
      // You can redirect the user to another page or perform any other actions here after logout
    }).catch(function(error) {
      // An error occurred during sign-out.
      console.error('Error logging out:', error)
    })
  } catch (error) {
    // An error occurred while attempting to sign out the user.
    console.error('Error signing out:', error)
  }
}