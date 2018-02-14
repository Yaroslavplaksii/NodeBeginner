const http = require('http');

const publics = require('./routes/public');
const home = require('./routes/home');
const search = require('./routes/search');
const nofound = require('./routes/nofound');
const render = require('./lib/render');

http.ServerResponse.prototype.render = render;

http.createServer((req,res)=>{
    if(req.url.match(/\.(html|js|css|png)$/)){
        publics(req,res);
    }else if(req.url === '/'){
        home(req,res);
    }else if(req.url.startsWith('/search')){
        search(req,res);
    }else{
        nofound(req,res);
    }
}).listen(3000,()=>console.log('Server is running'));