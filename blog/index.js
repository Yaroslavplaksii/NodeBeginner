//const blog = require('./models/config');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const admin = express();
const port = 8080;

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extendet:true}));

app.engine('handlebars',exphbs({
    defaultLayout:__dirname + '/views/pages/layout',
    layoutsDir:__dirname + '/views/pages',
    partialsDir:[
        __dirname + '/views/pages/partials'
    ],
    helpers:{}
}));




app.set('view engine','handlebars');

app.get('/',(req,res)=>{
    res.render('pages/index',{
        title:'Home'
    });
});

app.get('/profile',(req,res)=>{
    res.render('pages/profile',{
        title:'Profile'
    });
});

app.get('/about-me',(req,res)=>{
    res.render('pages/about-me',{
        title:'About'
    });
});

app.get('/contacts',(req,res)=>{
    res.render('pages/contacts',{
        title:'Contacts'
    });
});

app.get('/login',(req,res)=>{
    res.render('pages/login',{
        title:'Login'
    });
});

app.get('/register',(req,res)=>{
    res.render('pages/register',{
        title:'Register'
    });
});

app.get('/list',(req,res)=>{
    res.render('pages/list');
});

app.get('/blog',(req,res)=>{
    res.render('pages/blog');
});

admin.use(express.static(path.join(__dirname,'public')));
admin.use(bodyParser.json());
admin.use(bodyParser.urlencoded({extendet:true}));

admin.get('/categories',(req,res)=>{
    res.render('admin/categories/index');
});

admin.get('/tags',(req,res)=>{
    res.render('admin/tags/index');
});

admin.get('/posts',(req,res)=>{
    res.render('admin/posts/index');
});

admin.engine('handlebars',exphbs({
    defaultLayout:__dirname + '/views/admin/layout',
    layoutsDir:__dirname + '/views/admin',
    partialsDir:[
        __dirname + '/views/admin/partials'
    ],
    helpers:{}
}));
admin.get('/',(req,res)=>{
    res.render('admin/index');
});
app.use('/admin',admin);

app.use((req,res,next)=>{
    res.status(404);
    if(req.accepts('html')){
        res.render('pages/404',{
            url:req.url
        });
        return;
    }
    if(req.accepted('json')){
        res.send({error:'Not Found'});
        return;
    }
    res.type('txt').send('Not Found');
});

app.listen(port,()=>console.log('Server is running.....'));
