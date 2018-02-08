const http = require('http');
const server = http.createServer((req,res)=>{
    console.log(req.url);
    console.log(req.method);
    console.log(req.headers);

    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Server its work');
}).listen(3000,()=>console.log('Server working'));