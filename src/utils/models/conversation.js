export class ConversationModel {
  constructor(message, senderId, timestamp) {
    this._message = message
    this._senderId = senderId
    this._timestamp = timestamp
  }

  getMessage() {
    return this._message
  }

  getSenderId() {
    return this._senderId
  }

  getTimestamp() {
    return this._timestamp
  }
}
