// Initialize Firebase for the application
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.PUBLIC_FIREBASE_DATABASEURL,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize the Firebase app with the configuration
const app = initializeApp(firebaseConfig)
// Get the authentication instance from the initialized app.
export const auth = getAuth(app)
// Export the app instance for potential use by other services.
export default app


export function CurrentUserId() {
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      return user.uid
    } else {
      // Handle the case where there's no current user
      console.warn('No user currently signed in.')
      return null // Or handle it differently based on your logic
    }
  } catch (error) {
    // Handle any errors that occur during authentication
    console.error('Error retrieving current user:', error)
    return null // Or handle it differently based on your error handling strategy
  }
}