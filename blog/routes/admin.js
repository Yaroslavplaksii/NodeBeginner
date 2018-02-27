var express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var router = express();

router.use(express.static(path.join(__dirname,'public')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/categories',(req,res)=>{
    res.render('admin/categories/index');
});

router.get('/tags',(req,res)=>{
    res.render('admin/tags/index');
});

router.get('/posts',(req,res)=>{
    res.render('admin/posts/index');
});

router.get('/',(req,res)=>{
    if (req.isAuthenticated() && res.user.is_admin ===0) {
        res.render('admin/index');
    }else{
        res.redirect('/');
    }
});

module.exports = router;