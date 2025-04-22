
class User {

	constructor(email, id, firstName, lastName) {
    	this.email = email;
      	this.id = id;
    	this.firstName = firstName;
    	this.lastName = lastName
    }
    
    getUserInfo() {
    	return `(${this.firstName} ${this.lastName}, ${this.email}, ID: ${this.id})`;
    }
}
  
export default User;