const http = require('http');

function get(title,done){
    const req = http.get(`http://www.omdbapi.com/?t=${title}`,res=>{
        if(res.statusCode !==200){
            done(new Error(`Error ${res.statusMessage} ${res.statusCode}`));
            res.resume();//для видалення обэкта з памяті
            return;
        }
        res.setEncoding('utf-8');
        let body;
        res.on('data',data=>body+=data);
        res.on('end',()=>{
            let result;
            try{
                result = JSON.parse(body);
            }catch(error){
                done(error);
            }
            if(result.Response === 'False') return Done(new Error('film not found'));
            done(null,result);
        });
    });
    req.on('error',error=>done(error));
}

module.exports = {
    get
};