console.log('module');

// function  getUsers(){
//     return users;
// }
//const users = ['Name1','Name2','Name3'];
//module.exports.us = getUsers;

// const users = require('./users.json');
// module.exports.us = users;

const users = ['Name1','Name2','Name3'];
function  getUsers(){
    return users;
}

class Users{
    constructor(username,lastname){
        this.username = username;
        this.lastname = lastname;
    }
}

module.exports = {
    Users,
    users,
    getUsers
}