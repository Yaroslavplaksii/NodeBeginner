const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser('Secret key'));

app.get('/',(req,res)=>{
    res.cookie('login','admin');
    console.log(req.cookie);

    //res.clearCookie('login');
    res.end();
});

app.listen(8080,()=>console.log('Server is running'));