export class Item {
  constructor(key, userId, avatar, fullName, title, description, fileName, imageUrl) {
    this.key = key
    this.userId = userId
    this.avatar = avatar
    this.fullName = fullName
    this.title = title
    this.description = description
    this.fileName = fileName
    this.imageUrl = imageUrl
  }
    
  // Getter method for key
  getKey() {
    return this.key
  }
    
  // Getter method for userId
  getUserId() {
    return this.userId
  }
    
  // Getter method for avatar
  getAvatar() {
    return this.avatar
  }
    
  // Getter method for fullName
  getFullName() {
    return this.fullName
  }
    
  // Getter method for title
  getTitle() {
    return this.title
  }
    
  // Getter method for description
  getDescription() {
    return this.description
  }
    
  // Getter method for fileName
  getFileName() {
    return this.fileName
  }
    
  // Getter method for imageUrl
  getImageUrl() {
    return this.imageUrl
  }
}
    