export class User {
    
  constructor(id, fullName, avatar) {
    this._id = id
    this._fullName = fullName
    this._avatar = avatar
  }
  
  // Getter for ID
  get id() {
    return this._id
  }
  
  // Getter for fullName
  get fullName() {
    return this._fullName
  }
  
  // Getter for avatar
  get avatar() {
    return this._avatar
  }
}
  