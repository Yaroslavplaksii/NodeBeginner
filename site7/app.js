const express = require('express');
const todos = require('./todo');
const morgan = require('morgan');
// const pug = require('pug');

const app = express();

// 1 спосіб
/*
function log(req,res,next){ //moddleware ф-я розширення експреса додатковими ф-ми
    let date = new Date(Date.now());
    console.log(`${date} = ${req.method} - ${req.url}`);
    next();
}
//app.use('/log',log);//реєструємо або вказуємо що будемо  використовувати
app.use(log);*/
/*
// 2 спосіб
app.use('/log',(req,res,next)=>{
    let date = new Date(Date.now());
    console.log(`${date} = ${req.method} - ${req.url}`);
    next();
});*/
app.set('view engine','pug');
//app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));
app.get('/',(req,res)=>{
    //res.end('Express');//не буде вказано заголовок Content-Type
    //res.send('Express');
   // res.send({title:"Test express"});//відправка json
    //res.json({title:"Test express"});
   res.render('index',{
       title:"Node pug let go!",
       todos
   });
});

app.get('/todo',(req,res)=>{
    if(req.query.completed){
        return res.json(todos.filter(todo=>todo.completed.toString() === req.query.completed));
    }
    res.json(todos);
});

app.get('/todo/:id',(req,res)=>{
    let todo = todos.find(todo=>todo.id==req.params.id);
    //if(!todo) return res.sendStatus(404);
    if(!todo) return res.status(404).send("Not mony no hyni");
    res.json(todo);
});

app.listen(3000,()=>console.log('Server is working'));