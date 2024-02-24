export class Chatroom {

  constructor(chatroomId, userIds, lastMessageTimestamp, lastMessageSenderId, lastMessage) {
    this.chatroomId = chatroomId
    this.userIds = userIds
    this.lastMessageTimestamp = lastMessageTimestamp
    this.lastMessageSenderId = lastMessageSenderId
    this.lastMessage = lastMessage
  }
  
  getChatroomId() {
    return this.chatroomId
  }
  
  getUserIds() {
    return this.userIds
  }
  
  getLastMessageTimestamp() {
    return this.lastMessageTimestamp
  }
  
  getLastMessageSenderId() {
    return this.lastMessageSenderId
  }
  
  getLastMessage() {
    return this.lastMessage
  }
}