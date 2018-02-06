const users = ['Name1','Name2','Name3'];

function  getUsers(){
    return users;
}

class User{
    constructor(name,lastname){
        this.name = name;
        this.lastname = lastname;
    }
}
module.exports = {
    User,
   // users,
    ///getUsers
}