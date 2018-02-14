const express = require('express');
const cookieSession = require('cookie-session');

const app = express();

app.use(cookieSession({
    name: 'Session',
    keys:['key1','key2']
}));

app.get('/',(req,res,next)=>{

    console.log(req.ip);

    if(req.session.isNew)
        console.log("Session created");
    req.session.views = (req.session.views || 0) + 1;
    res.end(req.session.views + "views");
});

app.listen(8080,()=>console.log('Server is running'));