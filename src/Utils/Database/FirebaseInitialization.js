// Initialize Firebase for the application
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

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
// Get Firestore instance
export const firestore = getFirestore(app)
// Get Real-Time Database instance
export const database = getDatabase(app)
// Export the app instance for potential use by other services.
export default app


export function CurrentUserId() {
  // Listen for authentication state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
    // User is signed in, you can proceed with accessing data or features that require authentication
      console.log('User is signed in:', user.uid)
      return user.uid
    } else {
    // No user is signed in, handle this case accordingly
      console.log('No user is signed in.')
    }
    return false
  })
}