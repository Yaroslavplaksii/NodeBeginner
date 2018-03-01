const mysql = require('mysql');
const slug = require('../modules/slug');
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
    getCategoryBySlug:(data,callback)=>{
        connection.query("SELECT id,slug FROM categories WHERE slug = ?",[data.slug],callback);
    },
    getAllCategories:(callback)=>{
        connection.query("SELECT * FROM categories",callback);
    },
    addCategories:(title,callback)=>{
        let newSlug = slug(title.title);
        let res = null;
        connection.query("SELECT slug FROM categories",(error,data)=>{
            res = data;
            if(res){
                for(let i in res){
                    if(res[i].slug === newSlug){
                        let temp = +res[i].slug.replace(/\D+/g,'');
                        newSlug = slug(title.title.replace(/\d+/g,''))+(parseInt(temp)+1);
                    }
                }
            }
            connection.query("INSERT INTO categories (title, slug, created_at, updated_at) VALUES (?,?,?,?)",
                [title.title, newSlug,  new Date().toLocaleString(), new Date().toLocaleString()],callback);
       });
    },
    getCategoryById:(id,callback)=>{
        connection.query("SELECT * FROM categories WHERE id=?",id,callback);
    },
    editCategory:(data,callback)=>{ //return console.log(id)
        connection.query("UPDATE categories SET title=? WHERE id=?",[data.title,data.id],callback);
    },
    deleteCategory:(data,callback)=>{
        connection.query("DELETE FROM categories WHERE id=?",[data.id],callback);
    }
};

module.exports = Categories;