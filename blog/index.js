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
    res.render('pages/index');
});

app.get('/about-me',(req,res)=>{
    res.render('pages/about-me');
});

app.get('/login',(req,res)=>{
    res.render('pages/login');
});

app.get('/register',(req,res)=>{
    res.render('pages/register');
});


admin.use(express.static(path.join(__dirname,'public')));
admin.use(bodyParser.json());
admin.use(bodyParser.urlencoded({extendet:true}));

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

app.listen(port,()=>console.log('Server is running.....'));
