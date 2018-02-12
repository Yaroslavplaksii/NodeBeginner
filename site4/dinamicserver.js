const fs = require('fs');
const http = require('http');
const path = require('path');

function parseBody(body){
    const result = {};
    const keyValuePairs = body.split('&');
    keyValuePairs.forEach(keyValue => {
        const [key,value] = keyValue.split('=');
        result[key] = value;
    });
    return result;
}

function render(template,data,done){
    fs.readFile(path.join(__dirname,'views',`${template}.view`),'utf-8',(error,file)=>{
        if(error) return done(error);
        let html = file;
        for(let prop in data){
            const regex = new RegExp(`{${prop}}`,'g');
            html = html.replace(regex,data[prop]);
        }
        done(null,html);
    });
}

http.createServer((req,res)=>{
    switch(req.method){
        case 'GET':
            const stream = fs.createReadStream(path.join(__dirname,'views','form.view'));
            res.writeHead(200,{'Content-Type':'text/html'});
            stream.pipe(res);
            break;
        case 'POST':
            let body = '';
            req.on('data',data=>body += data);
            req.on('end',()=>{
                const data = parseBody(body);
                render('post',data,(error,html)=>{
                   if(error){
                       res.writeHead(500,{'Content-Type':'text/plain'});
                       return res.end(error.message);
                   }
                   res.writeHead(200,{'Content-Type':'text/html'});
                   res.end(html);
                });
            });
            break;
    }
}).listen(3000,()=>console.log('Servrer is work'));