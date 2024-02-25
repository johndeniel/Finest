export class User {
    
  constructor(id, fullName, avatar) {
    this._id = id
    this._fullName = fullName
    this._avatar = avatar
  }
  
  // Getter for ID
  getId() {
    return this._id
  }
  
  // Getter for fullName
  getFullName() {
    return this._fullName
  }
  
  // Getter for avatar
  getAvatar() {
    return this._avatar
  }
}
  