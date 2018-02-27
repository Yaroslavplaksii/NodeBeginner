const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'blog'
});

connection.connect();

const Comments ={
    addComment:(data,callback)=>{
        connection.query("INSERT INTO comments (text, user_id, username, useremail, post_id, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
            [data.message, 0, data.name, data.email, 2, 0, new Date().toLocaleString(), new Date().toLocaleString()],callback);
    },
};

module.exports = Comments;