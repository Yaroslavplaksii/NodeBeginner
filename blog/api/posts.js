const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'blog'
});

connection.connect();

const Posts={
    allPosts:(callback)=>{
        connection.query("SELECT * FROM posts",callback);
    },
    onePost:(id,callback)=>{
        connection.query("SELECT * FROM posts WHERE id=?",id,callback);
    },
    dellPost:(id,callback)=>{
        connection.query("DELETE FROM posts WHERE id=?",id,callback);
    }
};

module.exports = Posts;