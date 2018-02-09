const http = require('http');
const todos = require('./data/todo');

http.createServer((req,res)=>{
    if(req.url == '/todos'){
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(todos));
    }else if(req.url === '/todos/completed'){
        const completed = todos.filter(todo=>todo.completed);//поверне тільки які істина
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(completed));
    }else if(req.url.match(/\/todos\/\d+/)){
        const id = req.url.replace(/\D+/,'');
        const todo = todos.filter(todo=>todo.id == id);
        if(!todo){
            res.writeHead(404,{'Content-Type':'text/plain'});
            res.end('Not found');
        }else{
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
            res.end(JSON.stringify(todo));
        }
    }else{
        res.writeHead(404,{'Content-Type':'text/plain'});
        res.end('Not found');
    }
}).listen(3000,()=>console.log('Server running'));