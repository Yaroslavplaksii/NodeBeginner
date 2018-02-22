const posts = require('./models/posts');
const api = require('./api/posts');
const categories = require('./models/categories');

const connection = require('./models/config');
connection.connect();

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');
const morgan = require('morgan');
const flash = require('connect-flash');


//var route = require('./routes/controllers');
// model
//var Model = require('./models/model');
const app = express();
const admin = express();


const port = 8080;


app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(require('cookie-parser')());
app.use(session({secret:'keycat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));


app.use((req,res,next)=>{
    if(!res.locals){
        res.locals={};
    }
    categories.allCategories((error,rows)=>{
        res.locals.categories = rows;
    });
    posts.futuredPosts((error,rows)=>{
        res.locals.futured = rows;
    });
    posts.popularPosts((error,rows)=>{
        res.locals.popular = rows;
    });
    posts.recentPosts((error,rows)=>{
        res.locals.recent = rows;
    });
    next();
});

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


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
/************************/
passport.use(
    new LocalStrategy({
            usernameField: 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('info', 'That username is already taken.'));
                }
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                return done(null, rows[0]);
            });
        })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
        done(err, rows[0]);
    });
});

/***********************/
app.get('/',(req,res)=>{
    posts.indexNews((error,rows)=>{
        res.render('pages/index',{
            title:'Home page',
            results:rows
        });
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

app.get('/login',isLoggedIn, function (req, res) {
        res.render('pages/login', { message: bcrypt.hashSync("1111")
});
});
app.post('/login', passport.authenticate('local',
    { successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/logout', function(req, res) {
    res.render('pages/login', { message: '' });
});

app.post('/logout', passport.authenticate('local', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/logout', // redirect back to the signup page if there is an error
   // failureFlash : true // allow flash messages
}));
app.get('/register',isLoggedIn,function (req,res){
    res.render('pages/register',{
        title:'Register'
    });
});
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('pages/profile', {
        user : req.user // get the user out of session and pass to template
    });
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
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
    connection.query("INSERT INTO comments (text, user_id, username, useremail, post_id, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
        [req.body.message, 0, req.body.name, req.body.email, 2, 0, new Date().toLocaleString(), new Date().toLocaleString()],(error,data)=>{
        if(error) throw error;
        res.redirect('/');
    });
});

admin.use(express.static(path.join(__dirname,'public')));
admin.use(bodyParser.json());
admin.use(bodyParser.urlencoded({extended:true}));

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




/*rest api*/
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
/*end rest api*/

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
