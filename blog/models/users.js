const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'blog'
});

connection.connect();
// function findOne(email,done){
//     connection.query('SELECT * FROM users WHERE name=? ',[email.email],(data)=>{
//         if(data){
//             return  data;
//         }
//     });
// }

const UserData = {
    updateProfile: (user, callback) => {
        connection.query('UPDATE users SET name=?,email=? WHERE id=?', [user.name, user.email, parseInt(user.id)], callback);
    },
    updateAvatar: (user, callback) => {
        connection.query('UPDATE users SET avatar=? WHERE id=?', [user.avatar, parseInt(user.id)], callback);
    },
    updatePassword:(user,callback)=>{
        connection.query('UPDATE users SET password=? WHERE id=?', [user.password, parseInt(user.id)], callback);
    },
    getAvatar:(id,callback)=>{
        connection.query("SELECT avatar FROM users WHERE id=?",id,callback);
    }
};
module.exports = UserData;
