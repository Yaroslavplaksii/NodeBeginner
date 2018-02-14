const http = require('http');
const Cookie = require('cookies');

http.createServer((req,res)=>{
    let cookie = new Cookie(req,res);

    if(req.url === '/favicon.ico'){
        res.end();
        return;
    }

    cookie.set('admin','register');
    console.log(cookie.get('admin'));
    res.end();

    cookie.set('admin','register',{maxAge : -1, path:'/admin'});

}).listen(8080,()=>console.log('Server is work'));