const http = require('http');
const server = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>Nodejs</title>
</head>
<body>
<h1>Nodejs</h1>
</body>
</html>
    `);
}).listen(3000,()=>console.log('Server working'));