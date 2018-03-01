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
    },
    getPostsByCategory:(data,callback)=>{
        connection.query("SELECT * FROM posts WHERE category_id = ? LIMIT 10",[data.id],callback);
    },
    getPostBySlug:(data,callback)=>{
        connection.query("SELECT * FROM posts WHERE slug=?",[data.slug],callback);
    },
    getNextBlog:(data,callback)=>{
        connection.query("SELECT MIN(id),image,slug,title FROM posts WHERE id > ? LIMIT 1",[data.id],callback);
    },
    getPreviouseBlog:(data,callback)=>{
        connection.query("SELECT MAX(id),image,slug,title FROM posts WHERE id < ? LIMIT 1",[data.id],callback);
    },
    getSimilarPosts:(data,callback)=>{
        connection.query("SELECT * FROM posts WHERE category_id=?",[data.category_id],callback);
    },
    randomPosts:(callback)=>{
        connection.query("SELECT slug,image,title FROM posts WHERE id IN (SELECT id FROM posts WHERE status=1 AND id <= CEIL(RAND()*(SELECT COUNT(id) FROM posts))) ORDER BY id DESC LIMIT 1",callback);
    }
};
module.exports = Posts;