const http = require('http');
const fs = require('fs');
const path = require('path');

function handlerError(error,res){
    res.writeHead(500,{'Content-Type':'text/plain'});
    res.end(error.message);
}
http.createServer((req,res)=>{
    if(req.url === '/'){
        fs.readFile(path.join(__dirname,'public','index.html'),(error,html)=>{
            if(error){
               return handlerError(error,res);
            }else{
                res.writeHead(200,{'Content-Type':'text/html'});
                res.end(html);
            }
        });
    }else if(req.url.match(/.css$/)){
        const stream = fs.createReadStream(path.join(__dirname,'public',req.url));
        stream.on('error',error=>handlerError(error,res));
        res.writeHead(200,{'Content-Type':'text/css'});
        stream.pipe(res);
        // fs.readFile(path.join(__dirname,'public',req.url),(error,css)=>{
        //     if(error){
        //         return handlerError(error,res);
        //     }else{
        //         res.writeHead(200,{'Content-Type':'text/css'});
        //         res.end(css);
        //     }
        // });
    }else if(req.url.match(/.js$/)){
        const stream = fs.createReadStream(path.join(__dirname,'public',req.url));
        stream.on('error',error=>handlerError(error,res));
        res.writeHead(200,{'Content-Type':'text/javascript'});
        stream.pipe(res);
        // fs.readFile(path.join(__dirname,'public',req.url),(error,js)=>{
        //     if(error){
        //         return handlerError(error,res);
        //     }else{
        //         res.writeHead(200,{'Content-Type':'text/javascript'});
        //         res.end(js);
        //     }
        // });
    }else if(req.url.match(/.png$/)){
        const stream = fs.createReadStream(path.join(__dirname,'public',req.url));
        stream.on('error',error=>handlerError(error,res));
        res.writeHead(200,{'Content-Type':'image/png'});
        stream.pipe(res);
        // fs.readFile(path.join(__dirname,'public',req.url),(error,image)=>{
        //     if(error){
        //         return handlerError(error,res);
        //     }else{
        //         res.writeHead(200,{'Content-Type':'image/png'});
        //         res.end(image);
        //     }
        // });
    }else{
        res.writeHead(404,{'Content-Type':'text/html'});
        res.end('404 page not found');
    }
}).listen(3000,()=>console.log('Server it workl'));