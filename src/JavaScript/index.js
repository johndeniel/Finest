import { auth } from '../Utils/Database/FirebaseInitialization'

try {
  // Add an authentication state observer
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // Redirect to Home.html after successful authentication
      window.location.href = '/Home.html'
    } else {
      // Redirect to Authentication.html after successful authentication
      window.location.href = '/Authentication.html'
    }
  })
} catch (error) {
  // Log the error to the console
  console.error('Error in authentication state observer:', error)
}