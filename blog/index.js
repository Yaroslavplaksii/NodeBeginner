const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
//const async = require('async');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const sess  = require('express-session');
const Store = require('express-session').Store
const BetterMemoryStore = require(__dirname + '/memory')
const store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true })
app.use(sess({
    name: 'JSESSION',
    secret: 'MYSECRETISVERYSECRET',
    store:  store,
    resave: true,
    saveUninitialized: true
}));

//const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const morgan = require('morgan');
const flash = require('connect-flash');
const connection = require('./models/config');
connection.connect();

const admin = require('./routes/admin');



//const api = require('./api/route');
//const admin = express();

const port = 8080;
//
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(require('cookie-parser')());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));

const posts = require('./models/posts');
const api = require('./api/posts');
const categories = require('./models/categories');
const comments = require('./models/comments');


const userData = require('./models/users');


/*блок новин і категорій на сайдбар*/
app.use((req,res,next)=> {
    if (!res.locals) {
        res.locals = {};
    }
    res.locals.authenticated = req.isAuthenticated();
    categories.allCategories((error, rows) => {
        if(error) throw error;
        res.locals.categoriesAll = rows;
    });
    posts.futuredPosts((error, rows) => {
        res.locals.futured = rows;
    });
    posts.popularPosts((error, rows) => {
        res.locals.popular = rows;
    });
    posts.recentPosts((error,rows)=>{
        res.locals.recent = rows;
    });
    next();
});
/*-------------------------------*/



app.engine('handlebars',exphbs({
    defaultLayout:__dirname + '/views/pages/layout',
    layoutsDir:__dirname + '/views/pages',
    partialsDir:[
        __dirname + '/views/pages/partials'
    ],
    helpers:{
        getTime:function(){
                    let myDate = new Date();
                    let hour = myDate.getHours();
                    let minute = myDate.getMinutes();
                    let second = myDate.getSeconds();
                    if (minute < 10) {
                        minute = "0" + minute;
                    }
                    if (second < 10) {
                        second = "0" + second;
                    }
                    return "Time now: " + hour + ":" + minute + ":" + second;
                }
        }
}));

app.set('view engine','handlebars');

const salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
console.log(crypto.createHash('sha1').update(salt+''+12345).digest('hex'));
/************pasport.js**************/
passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true //passback entire req to call back
    } , function (req, email, password, done){
        //console.log(email+' = '+ password);
        if(!email || !password ) { return done(null, false, req.flash('message','All fields are required.')); }

        connection.query("select * from users where email = ?", [email], function(err, rows){
            console.log(err);
            if (err) return done(req.flash('message',err));

            if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
            salts = salt+''+password;
            let encPassword = crypto.createHash('sha1').update(salts).digest('hex');
            let dbPassword  = rows[0].password;

            if(!(dbPassword === encPassword)){
                return done(null, false, req.flash('message','Invalid username or password.'));
            }
            //console.log(rows[0].avatar);
            return done(null, rows[0]);
        });
    }
));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    connection.query("select * from users where id=?",[id], function (err, rows){
        done(err, rows[0]);
    });
});

/***********end passport.js***************/


app.get('/login', function(req, res){
    if (req.isAuthenticated()) {
        res.redirect('/');
        return;
    }
    res.render('pages/login',{'message' :req.flash('message')});
});


app.post("/login", passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res, info){
    res.render('pages/login',{'message' :req.flash('message')});
});

app.get('/logout', function(req, res){
    req.session.destroy();
    req.logout();
    res.redirect('/login');
});


app.get('/register',function (req,res){
    if (req.isAuthenticated()) {
        res.redirect('/');
        return;
    }
    res.render('pages/register',{
        title:'Register'
    });
});
app.get('/profile', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }
    res.render('pages/profile', {
        user : req.user
    });
});
app.post('/profile',(req,res)=>{
    if (req.isAuthenticated()) {
    const form = new formidable.IncomingForm();
    form.uploadDir = __dirname + "/public/uploads/";
    form.encoding = 'utf-8';
    form.keepExtensions= true;
    form.parse(req,(err,fields,files)=>{
        userData.updateProfile({
                id:fields.id,
                name:fields.name,
                email:fields.email
            },
            (error)=>{
                if(error) throw error;
            });
        if(fields.password.length > 0){
            userData.updatePassword({
                    id:fields.id,
                    password: crypto.createHash('sha1').update(salt+fields.password).digest('hex')
                },
                (error)=>{
                    if(error) throw error;
                });
        }
        if(files.avatar.path && files.avatar.name){
            userData.getAvatar(fields.id,(error,old_avatar)=>{
                if(fs.existsSync(__dirname + "/public/uploads/"+old_avatar[0].avatar)){
                    fs.unlinkSync(__dirname + "/public/uploads/"+old_avatar[0].avatar,(error)=>{
                        if(error) throw error;
                    });
                }
            });
                let oldpath = files.avatar.path;
                let newpath = __dirname + '/public/uploads/' + files.avatar.name;
                if(err) throw err;
                fs.rename(oldpath, newpath, (err)=>{
                    if(err) throw err;
                    userData.updateAvatar({
                            avatar: files.avatar.name,
                            id: fields.id
                        },
                        (error)=>{
                            if(error) throw error;
                        });
                });
        }
    });
      res.redirect(303,'/profile');
    }else{
        res.redirect(303,'/');
    }
});

app.get('/',(req,res)=>{
    posts.indexNews((error,rows)=>{
        res.render('pages/index',{
            title:'Home page',
            results:rows
        });
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

app.get('/list',(req,res)=>{
    posts.allPosts((error,allposts)=>{
        res.render('pages/list',{
            title:"All posts",
            allposts:allposts
        });
    });

});

app.get('/blog/:slug',(req,res)=>{
    connection.query("SELECT * FROM posts WHERE slug=?",[req.params.slug], function(err, blog) {
        connection.query("SELECT MIN(id),image,slug,title FROM posts WHERE id > ? LIMIT 1",[blog[0]['id']],(err,nextblog)=>{
           connection.query("SELECT MAX(id),image, slug ,title FROM posts WHERE id < ?",[blog[0]['id']],(err,previouseblog)=>{
               // res.locals.post_id = blog[0]['id'],
                   res.render('pages/blog', {
                       title: blog[0]['title'],
                       blog: blog,
                       nextblog:nextblog,
                       previouseblog:previouseblog,
                   });
           });
        });
    });
});
app.get('/category/:slug',(req,res)=>{
    connection.query("SELECT id,slug FROM categories WHERE slug = ?",[req.params.slug],(error,category)=>{
       connection.query("SELECT * FROM posts WHERE category_id = ? LIMIT 10",[category[0]['id']],(error,posts)=>{
           res.render('pages/list',{
               title:category[0]['title'],
               posts:posts
           });
       });
    });
});
app.post('/add_comment',(req,res)=>{
    comments.addComment({
        data:req.body
    },(error)=>{
        if(error) throw error;
        res.redirect('/');
    });
    // connection.query("INSERT INTO comments (text, user_id, username, useremail, post_id, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
    //     [req.body.message, 0, req.body.name, req.body.email, 2, 0, new Date().toLocaleString(), new Date().toLocaleString()],(error,data)=>{
    //     if(error) throw error;
    //
    // });
});


admin.engine('handlebars',exphbs({
    defaultLayout:__dirname + '/views/admin/layout',
    layoutsDir:__dirname + '/views/admin',
    partialsDir:[
        __dirname + '/views/admin/partials'
    ],
    helpers:{}
}));


// /*rest api*/
app.get('/api',(req,res)=>{
    res.send('API is working');
});
app.get('/api/posts',(req,res)=>{
    api.allPosts((error,allposts)=>{
        res.send(allposts);
    });
});
app.post('/api/posts',(req,res)=>{
    api.allPosts((error,allposts)=>{
        res.send(allposts);
    });
});
app.get('/api/posts/:id',(req,res)=>{
    api.onePost(req.params.id,(error,post)=>{
        res.send(post);
    });
});
app.put('/api/posts/:id',(req,res)=>{
    res.send('Put method');
});
app.delete('/api/posts/:id',(req,res)=>{
    api.dellPost(req.params.id,(error)=>{
        if(error){
            rest.send(error);
        }else{
            res.send('Posts is deleted!');
        }
    });
});
// /*end rest api*/
//app.use('/api',api);
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
