const http = require('http');
const server = http.createServer();//створення сервера

server.on('request',(req,res)=>{//підписуємо на подію
    res.writeHead(200,{'Content-Type':'text/plain'});//вказуємо заголовеки, буде і без них працювати
    res.end('Server its work');
});
server.listen(3000,()=>console.log('Server working'));//вказуємо порт і адрес, якщо потрібно, або ф-й зворотнього виклику