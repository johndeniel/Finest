export class UserModel {
    
  constructor(id, fullName, avatar) {
    this.id = id
    this.fullName = fullName
    this.avatar = avatar
  }
    
  // Getter for ID
  getId() {
    return this.id
  }
    
  // Getter for fullName
  getFullName() {
    return this.fullName
  }
    
  // Getter for avatar
  getAvatar() {
    return this.avatar
  }
}
    