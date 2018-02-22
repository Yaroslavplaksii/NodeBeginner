const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'blog'
});

connection.connect();

const Posts = {
    indexNews:(callback)=>{
        connection.query("SELECT * FROM posts LIMIT 5",callback);
    },
    allPosts:(callback)=>{
        connection.query("SELECT * FROM posts LIMIT 10",callback);
    },
    futuredPosts:(callback)=>{
        connection.query("SELECT * FROM `posts` WHERE is_featured = 1",callback);
    },
    popularPosts:(callback)=>{
        connection.query("SELECT * FROM `posts` ORDER BY views DESC LIMIT 3",callback);
    },
    recentPosts:(callback)=>{
        connection.query("SELECT * FROM `posts` ORDER BY created_at ASC LIMIT 4",callback);
    }
};
module.exports = Posts;