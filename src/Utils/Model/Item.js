export class Item {
  constructor(key, userId, avatar, fullName, title, description, fileName, imageUrl) {
    this._key = key
    this._userId = userId
    this._avatar = avatar
    this._fullName = fullName
    this._title = title
    this._description = description
    this._fileName = fileName
    this._imageUrl = imageUrl
  }
  
  // Getter method for key
  getKey() {
    return this._key
  }
  
  // Getter method for userId
  getUserId() {
    return this._userId
  }
  
  // Getter method for avatar
  getAvatar() {
    return this._avatar
  }
  
  // Getter method for fullName
  getFullName() {
    return this._fullName
  }
  
  // Getter method for title
  getTitle() {
    return this._title
  }
  
  // Getter method for description
  getDescription() {
    return this._description
  }
  
  // Getter method for fileName
  getFileName() {
    return this._fileName
  }
  
  // Getter method for imageUrl
  getImageUrl() {
    return this._imageUrl
  }
}
  