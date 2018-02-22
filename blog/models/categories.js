const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'blog'
});

connection.connect();

const Categories ={
    allCategories:(callback)=>{
        connection.query("SELECT categories.id AS CAT_ID, categories.slug, categories.title, (SELECT COUNT(id) FROM posts  WHERE category_id = CAT_ID) AS COUNT_POST FROM categories",callback);
    },


};

module.exports = Categories;