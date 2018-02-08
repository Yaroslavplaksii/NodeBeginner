const http = require('http');
const html = `<!DOCTYPE html>
       <html>
        <head>
       <title>Nodejs</title>
    <link href="/app.css" rel="stylesheet">
    </head>
    <body>
    <h1 class="classn">Nodejs</h1>
    <script src="/app.js"></script>
    </body>
    </html>`;
const css = `.classn{
    color:red}`;

    const js=`alert("hello world")`;

const server = http.createServer((req,res)=> {
    switch (req.url) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
            break;
        case '/app.css':
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(css);
            break;
        case '/app.js':
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(js);
            break;
        case '/':
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 not found');
    }
}).listen(3000,()=>console.log('Server working'));