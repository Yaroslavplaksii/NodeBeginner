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
const admin = express();

const flash = require('connect-flash');
const sess = require('express-session');
const Store = require('express-session').Store
const BetterMemoryStore = require(__dirname + '/memory')
const store = new BetterMemoryStore({expires: 60 * 60 * 1000, debug: false})
app.use(sess({
    name: 'JSESSION',
    secret: 'MYSECRETISVERYSECRET',
    store: store,
    resave: true,
    saveUninitialized: true
}));

//const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const morgan = require('morgan');

const connection = require('./models/config');
connection.connect();

//const admin = require('./routes/admin');

const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('cookie-parser')());
app.use(sess({cookie: { maxAge: 60000 }}));//from flash
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));

const api = require('./api/posts');
const categories = require('./models/categories');
const comments = require('./models/comments');
const posts = require('./models/posts');
const userData = require('./models/users');
const sendMail = require('./modules/mailer');

/*блок новин і категорій на сайдбар*/
app.use((req, res, next) => {
    if (!res.locals) {
        res.locals = {};
    }
    res.locals.authenticated = req.isAuthenticated();
    categories.allCategories((error, rows) => {
        if (error) throw error;
        res.app.locals.categoriesAll = rows;
    });
    posts.futuredPosts((error, rows) => {
        res.app.locals.futured = rows;
    });
    posts.popularPosts((error, rows) => {
        res.app.locals.popular = rows;
    });
    posts.recentPosts((error, rows) => {
        res.app.locals.recent = rows;
    });
    posts.randomPosts((error, rows) => {
        res.app.locals.ramdomPost = rows;
    });
    next();
});
/*-------------------------------*/


app.engine('handlebars', exphbs({
    defaultLayout: __dirname + '/views/pages/layout',
    layoutsDir: __dirname + '/views/pages',
    partialsDir: [
        __dirname + '/views/pages/partials'
    ],
    helpers: {
        getTime: function () {
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

app.set('view engine', 'handlebars');

const salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
//console.log(crypto.createHash('sha1').update(salt + '' + 12345).digest('hex'));
/************pasport.js**************/
passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true //passback entire req to call back
    }, function (req, email, password, done) {
        //console.log(email+' = '+ password);
        if (!email || !password) {
            return done(null, false, req.flash('message', 'All fields are required.'));
        }

       connection.query("select * from users where email = ?", [email], function (err, rows) {
            console.log(err);
            if (err) return done(req.flash('message', err));

            if (!rows.length) {
                return done(null, false, req.flash('message', 'Invalid username or password.'));
            }
            salts = salt + '' + password;
            let encPassword = crypto.createHash('sha1').update(salts).digest('hex');
            let dbPassword = rows[0].password;

            if (!(dbPassword === encPassword)) {
                return done(null, false, req.flash('message', 'Invalid username or password.'));
            }
            //console.log(rows[0]);
            return done(null, rows[0]);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {

    connection.query("select * from users where id=?",[id],function(err, rows){
        done(err, rows[0]);
    });
});
/***********end passport.js***************/


app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
        return;
    }
    res.render('pages/login', {'message': req.flash('message')});
});

app.post("/login", passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res, info) {
    res.render('pages/login', {'message': req.flash('message')});
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    req.logout();
    res.redirect('/login');
});

app.get('/register', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
        return;
    }
    res.render('pages/register', {
        title: 'Register'
    });
});
app.get('/profile', function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }else if(req.isAuthenticated() && req.user.is_admin==0) {
        res.render('pages/profile', {
            user: req.user
        });
    }else if(req.isAuthenticated() && req.user.is_admin==1){
        res.redirect(303, '/admin');
    }

});
app.post('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        const form = new formidable.IncomingForm();
        form.uploadDir = __dirname + "/public/uploads/";
        form.encoding = 'utf-8';
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            userData.updateProfile({
                    id: fields.id,
                    name: fields.name,
                    email: fields.email
                },
                (error) => {
                    if (error) throw error;
                });
            if (fields.password.length > 0) {
                userData.updatePassword({
                        id: fields.id,
                        password: crypto.createHash('sha1').update(salt + fields.password).digest('hex')
                    },
                    (error) => {
                        if (error) throw error;
                    });
            }
            if (files.avatar.path && files.avatar.name) {
                userData.getAvatar(fields.id, (error, old_avatar) => {
                    if (fs.existsSync(__dirname + "/public/uploads/" + old_avatar[0].avatar)) {
                        fs.unlinkSync(__dirname + "/public/uploads/" + old_avatar[0].avatar, (error) => {
                            if (error) throw error;
                        });
                    }
                });
                let oldpath = files.avatar.path;
                let newpath = __dirname + '/public/uploads/' + files.avatar.name;
                if (err) throw err;
                fs.rename(oldpath, newpath, (err) => {
                    if (err) throw err;
                    userData.updateAvatar({
                            avatar: files.avatar.name,
                            id: fields.id
                        },
                        (error) => {
                            if (error) throw error;
                        });
                });
            }
        });
        res.redirect(303, '/profile');
    } else{
        res.redirect(303, '/');
    }
});

app.get('/', (req, res) => {
    posts.indexNews((error, rows) => {
        res.render('pages/index', {
            title: 'Home page',
            results: rows
        });
    });
});

app.get('/about-me', (req, res) => {
    res.render('pages/about-me', {
        title: 'About'
    });
});

app.get('/contacts', (req, res) => {
    res.render('pages/contacts', {
        title: 'Contacts'
    });
});

app.get('/list', (req, res) => {
    posts.allPosts((error, allposts) => {
        res.render('pages/list', {
            title: "All posts",
            allposts: allposts
        });
    });

});

app.get('/blog/:slug', (req, res) => {
    posts.getPostBySlug({
        slug: req.params.slug
    }, (error, blog) => {
        posts.getNextBlog({
            id: blog[0]['id']
        }, (error, nextblog) => {
            posts.getPreviouseBlog({
                id: blog[0]['id']
            }, (error, previouseblog) => {
                posts.getSimilarPosts({
                    category_id:blog[0]['category_id']
                },(error,similar)=>{
                    res.render('pages/blog', {
                        title: blog[0]['title'],
                        blog: blog,
                        nextblog: nextblog,
                        previouseblog: previouseblog,
                        similars:similar
                    });
                });
            });
        });
    });
});
app.get('/category/:slug', (req, res) => {
        categories.getCategoryBySlug({
            slug: req.params.slug
        }, (error, data) => {
            posts.getPostsByCategory({
                id: data[0]['id']
            }, (error, posts) => {
                res.render('pages/list', {
                    title: data[0]['title'],
                    allposts: posts
                });
            });
        });
});
app.post('/add_comment', (req, res) => {
    if (req.isAuthenticated()) {
        comments.addComment({
            post_id: req.body.post_id,
            text: req.body.message,
            user_id: req.user.id
        }, (error, data) => {
            if (error) throw error;
            sendMail.sendMailOne(req.user.email,'Add comment','Your comment add!!!');
            res.redirect('back');
        });
    }else{
        res.redirect('/');
    }
});


admin.engine('handlebars', exphbs({
    defaultLayout: __dirname + '/views/admin/layout',
    layoutsDir: __dirname + '/views/admin',
    partialsDir: [
        __dirname + '/views/admin/partials'
    ],
    helpers: {}
}));


// /*rest api*/
app.get('/api', (req, res) => {
    res.send('API is working');
});
app.get('/api/posts', (req, res) => {
    api.allPosts((error, allposts) => {
        res.send(allposts);
    });
});
app.post('/api/posts', (req, res) => {
    api.allPosts((error, allposts) => {
        res.send(allposts);
    });
});
app.get('/api/posts/:id', (req, res) => {
    api.onePost(req.params.id, (error, post) => {
        res.send(post);
    });
});
app.put('/api/posts/:id', (req, res) => {
    res.send('Put method');
});
app.delete('/api/posts/:id', (req, res) => {
    api.dellPost(req.params.id, (error) => {
        if (error) {
            rest.send(error);
        } else {
            res.send('Posts is deleted!');
        }
    });
});

/******admins pages*******/
function adminAuthorizated(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/');
    }
}
admin.get('/categories',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        categories.getAllCategories((error,categories)=>{
            res.render('admin/categories/index',{
                categories:categories,
                message:req.flash()
            });
        });
    }else{
        res.redirect('/profile');
    }
});
/******Category page********/
admin.get('/categories/edit/:id',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        categories.getCategoryById(req.params.id,(error,category)=>{
            res.render('admin/categories/edit', {
                category:category,
                message:req.flash()
            });
        });
    }else{
        res.redirect('/profile');
    }
});
admin.post('/categories/edit/:id',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        categories.editCategory({
            title:req.body.title,
            id:req.params.id
        },(error)=>{
            if(error)
                req.flash('message', error);
        });
        req.flash('success', 'Category is updated!');
        res.redirect('back');
    }else{
        res.redirect('/profile');
    }
});
admin.get('/categories/create',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        res.render('admin/categories/create');
    }else{
        res.redirect('/profile');
    }
});
admin.post('/categories/create',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        categories.addCategories({
            title:req.body.title
        },(error)=>{
            if(error) throw error;
            req.flash('success', 'Error of create!');
        });
        req.flash('success', 'Category is add!');
        res.redirect('/admin/categories');
    }else{
        res.redirect('/profile');
    }
});
admin.get('/categories/delete/:id',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        categories.deleteCategory({
            id:req.params.id
        },(error)=>{
            if(error) //throw error;
                req.flash('success', 'Error delete!');
        });
        req.flash('success', 'Category is delete!');
        res.redirect('/admin/categories');
    }else{
        res.redirect('/profile');
    }
});
/*********Tags page**********/
admin.get('/tags',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        res.render('admin/tags/index');
    }else{
        res.redirect('/profile');
    }
});

/***********Posts page**************/
admin.get('/posts',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        res.render('admin/posts/index');
    }else{
        res.redirect('/profile');
    }
});
admin.get('/',adminAuthorizated,(req,res)=>{
    if(req.user.is_admin===1){
        res.render('admin/index');
    }else{
        res.redirect('/profile');
    }
});
app.use('/admin', admin);
/*******end admin block**********/

app.use((req, res, next) => {
    res.status(404);
    if (req.accepts('html')) {
        res.render('pages/404', {
            url: req.url
        });
        return;
    }
    if (req.accepted('json')) {
        res.send({error: 'Not Found'});
        return;
    }
    res.type('txt').send('Not Found');
});

app.listen(port, () => console.log('Server is running..... ENV - '+app.get('env') + ', Port - '+port));
