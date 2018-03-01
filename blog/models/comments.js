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
        connection.query("INSERT INTO comments (text, user_id, post_id, status, created_at, updated_at) VALUES (?,?,?,?,?,?)",
            [data.text, data.user_id, data.post_id, 0, new Date().toLocaleString(), new Date().toLocaleString()],callback);
    },
};

module.exports = Comments;