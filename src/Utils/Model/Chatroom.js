import { Timestamp } from 'firebase/firestore'

export class Chatroom {
  constructor(
    chatroomId,
    userIds = [],
    lastMessageTimestamp = Timestamp.now(),
    lastMessageSenderId = '',
    lastMessage = ''
  ) {
    this.chatroomId = chatroomId
    this.userIds = userIds
    this.lastMessageTimestamp = lastMessageTimestamp
    this.lastMessageSenderId = lastMessageSenderId
    this.lastMessage = lastMessage
  }

  // Getter and setter methods (optional, similar to Java)

  static createFromDoc(doc) {
    if (!doc.exists()) {
      throw new Error('Chatroom document does not exist.')
    }
    const data = doc.data()
    return new Chatroom(
      data.chatroomId,
      data.userIds || [],
      data.lastMessageTimestamp || Timestamp.now(),
      data.lastMessageSenderId || '',
      data.lastMessage || ''
    )
  }
}