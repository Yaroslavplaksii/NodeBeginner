function notfound(req,res){
    res.render('error.html',{error:"Not found"});
}

module.exports = notfound;