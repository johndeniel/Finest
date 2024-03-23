// Initialize Firebase for the application
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, doc } from 'firebase/firestore'
import { getDatabase, ref, child } from 'firebase/database'

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



// Exported function to get the Firestore document reference for the items collection.
// Returns: Firestore document reference.
// Example usage: const itemsRef = getItemsDatabaseReference();
export function getItemsDatabaseReference() {
  return ref(database, ITEMS_REFERENCE)
}



export function getSwipeLocation(itemKey) {
  return child(child(ref(database, ITEMS_REFERENCE), itemKey), 'swipe')
}


// Returns the Firestore document reference for a specific user based on their UUID.
// Parameters:
// - uuid: The UUID of the user.
// Returns: Firestore document reference.
// Example usage: const userDocRef = allUserCollectionReference('example_uuid');
// Document fields: uuid, fullName, avatar
export function allUserCollectionReference(uuid) {
  return doc(firestore, USER_REFERENCE, uuid)
}


// Returns the Firestore collection reference for all chatrooms.
// Returns: Firestore collection reference.
// Example usage: const chatroomCollectionRef = allChatroomCollectionReference()
export function allChatroomCollectionReference() {
  return collection(firestore, CHATROOM_REFERENCE)
}


// Retrieves the Firestore document reference for the other user in a chatroom based on their user ID and the chatroom participants.
// Parameters:
// - user: The user ID of the current user.
// - chatroom: An array containing the user IDs of both users in the chatroom.
// Returns: Firestore document reference for the other user in the chatroom.
// Example usage: const otherUserRef = getOtherUserFromChatroom('current_user_id', ['user_id_1', 'user_id_2'])
// Purpose: Map each chatroom to its corresponding user document reference using getOtherUserFromChatroom function.
export function getOtherUserFromChatroom(user, chatroom) {
  if (user === chatroom[0]) {
    return doc(collection(firestore, USER_REFERENCE), chatroom[1])
  } else {
    return doc(collection(firestore, USER_REFERENCE), chatroom[0])
  }
}


export function getChatroomReference(chatroomId) {
  return doc(collection(firestore, CHATROOM_REFERENCE), chatroomId)
}


export function getChatroomMessageReference(chatroomId) {
  return collection(getChatroomReference(chatroomId), CHATROOM_REFERENCE)
}


export const getNowTimeStamp = () =>{
  return firestore.Timestamp.now()
}