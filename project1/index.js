const express = require('express');
const port = 8080;

const app = express();
const admin = express();
const user = express();

app.get('/',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'})
    res.write('<a href="/admin">admin</a>');
    res.write('<br>');
    res.write('<a href="/user">user</a>');
    res.end();
});

admin.get('/',(req,res)=>{
    res.send('Admin page');
});
admin.on('mount',()=>console.log('admin mounted'));

user.get('/',(req,res)=>{
   res.send('User page');
});
user.on('mount',()=>console.log('user page'));

app.use('/admin',admin);
app.use('/user',user);

app.listen(port,()=>console.log('Server start'));