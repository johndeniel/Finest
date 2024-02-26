export class Chatroom {

  constructor(chatroomId, userIds, lastMessageTimestamp, lastMessageSenderId, lastMessage) {
    this._chatroomId = chatroomId
    this._userIds = userIds
    this._lastMessageTimestamp = lastMessageTimestamp
    this._lastMessageSenderId = lastMessageSenderId
    this._lastMessage = lastMessage
  }
  
  getChatroomId() {
    return this._chatroomId
  }
  
  getUserIds() {
    return this._userIds
  }
  
  getLastMessageTimestamp() {
    return this._lastMessageTimestamp
  }
  
  getLastMessageSenderId() {
    return this._lastMessageSenderId
  }
  
  getLastMessage() {
    return this._lastMessage
  }
}