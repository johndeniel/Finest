// Initialize Firebase for the application
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, doc } from 'firebase/firestore'
import { getDatabase, ref, child } from 'firebase/database'

let   currentUserId
const ITEMS_REFERENCE = 'items'
const USER_REFERENCE = 'users'
const CHATROOM_REFERENCE = 'chatroom'

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

export async function getCurrentUserId() {
  try {
    currentUserId = await new Promise((resolve) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user.uid)
        } else {
          resolve(null)
        }
      })
    })
  } catch (error) {
    console.error('Error fetching user ID:', error)
  }
}

getCurrentUserId()

export function getItemsDatabaseReference() {
  return ref(database, ITEMS_REFERENCE)
}

export function getSwipeLocation(itemKey) {
  return child(child(ref(database, ITEMS_REFERENCE), itemKey), 'swipe')
}

export function allChatroomCollectionReference() {
  return collection(firestore, CHATROOM_REFERENCE)
}

export function getChatroomReference(chatroomId) {
  return doc(collection(firestore, CHATROOM_REFERENCE), chatroomId)
}

export function getChatroomMessageReference(chatroomId) {
  return collection(getChatroomReference(chatroomId), CHATROOM_REFERENCE)
}

export function allUserCollectionReference(recipientUuid) {
  return doc(firestore, USER_REFERENCE, recipientUuid)
}

export function getOtherUserFromChatroom(userIds) {
  if (userIds[0] === currentUserId) {
    return doc(collection(firestore, USER_REFERENCE), userIds[1])
  } else {
    return doc(collection(firestore, USER_REFERENCE), userIds[0])
  }
}

export const getNowTimeStamp = () =>{
  return firestore.Timestamp.now()
}