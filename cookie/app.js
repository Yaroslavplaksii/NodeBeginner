const express = require('express');

const app = express();
// app.use('/',(req,res)=>{
//     console.log(req.headers['cookie']);
//     res.sendFile(__dirname + '/index.html');
// });

app.use('/',(req,res)=>{
    console.log('Cookie from client:',req.headers['cookie']);
    //res.setHeader('Set-Cookie','TestSendCookie');
    res.setHeader('Set-Cookie',['name1=val1','name2=val2']);
    console.log('Method ',res.getHeader('Set-Cookie'));
    res.sendFile(__dirname + '/index.html');
});


app.listen(8080,()=>console.log('Server is running'));