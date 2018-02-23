var express = require('express');
const model = require('./posts');

var api = express();
/*rest api*/
api.get('/api',(req,res)=>{
    res.send('API is working');
});
api.get('/api/posts',(req,res)=>{
    model.allPosts((error,allposts)=>{
        res.send(allposts);
    });
});
api.post('/api/posts',(req,res)=>{
    model.allPosts((error,allposts)=>{
        res.send(allposts);
    });
});
api.get('/api/posts/:id',(req,res)=>{
    model.onePost(req.params.id,(error,post)=>{
        res.send(post);
    });
});
api.put('/api/posts/:id',(req,res)=>{
    res.send('Put method');
});
api.delete('/api/posts/:id',(req,res)=>{
    model.dellPost(req.params.id,(error)=>{
        if(error){
            rest.send(error);
        }else{
            res.send('Posts is deleted!');
        }
    });
});
/*end rest api*/

module.exports = api;