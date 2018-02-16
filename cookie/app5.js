const express = require('express');
const app = express();

const port = 8080;

const session = require('express-session');
const MSSQLStore = require('connect-mssql')(session);

const mssql = require('mssql');
let config ={
    user:'test',
    password:'12345',
    server:'localhost',
    database:'testdb',
    port:1433,
    pool:{
        max:10,
        min:0,
        idleTimeout:30000
    }
};

app.use(session({
    store:new MSSQLStore(config),
    resave:false,
    saveUnitialized:true,
    secret:'supersecret'
}));

app.get('/',(req,res)=>{
    console.log(req.session);
    req.session.numberOfRequest = req.sesion.numberOfRequest + 1;
    let requestCoun = ()=>{
        return isNaN(req.sesion.numberOfRequest)?0:req.sesion.numberOfRequest;
    };
    req.end('Number of request: '+ requestCount());
});


app.listen(port,()=>console.log('Server its working'));