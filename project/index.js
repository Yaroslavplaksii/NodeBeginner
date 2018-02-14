const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
let router = express.Router();

// app.use('/',(req,res,next)=>{
//     // console.log('nexy function ');
//     res.cookie('May','Test');
//     next();
// });

// const filename = 'log.txt';
// app.use((req,res)=>{
//    let data = `Address: ${req.ip}; ${new Date().toLocaleString()}; ${req.url}\n`;
//    fs.appendFile(filename,data,error=>{
//       if(error) console.log('errro file name');
//    });
// });

// router.route("/")
//     .get((req,res)=>{
//        res.send("Get method get");
//     })
//     .post((req,res)=>{
//        res.send("Post method");
//     });
// router.route("/:id")
//     .get((req,res)=>{
//        res.send("get send id");
//     });
// app.use('/category',router);


app.get('/page',(req,res)=>{
   res.sendFile(path.join(__dirname,'main.html'));
});
/*app.get('/[a-zA-Z]*\.js$/',(req,res)=>{
   res.sendFile(path.join(__dirname,req.url));
});*/
const catalog = '/project';
app.use('/',express.static(path.join(__dirname)));

app.get('/',(req,res)=>{
   res.send("<h1>Index</h1>");
});
/*
app.get('/[a-zA-Z]*\.html$/',(req,res)=>{
   res.send(req.url);
   res.end();
});*/

app.get('/category/:name/:id',(req,res)=>{
   console.log(req.params);
});
/*
app.get('*',(req,res)=>{
   console.log(req.method);
   console.log(req.query);
   console.log(req.protocol);
   console.log(req.secure);
});*/
app.listen(8080,()=>console.log('Start server'));