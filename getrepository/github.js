const https = require('https');//для роботи з https

function getRepos(username,done){
    if(!username) return done(new Error('Enter usernsame'));

    const options = {//для того що отримати відповідь 200 від сервера, потрібно передати заголовки
        'hostname':'api.github.com',//вказуємо  хост
        'path':`/users/${username}/repos`,//шлях запиту
        'headers':{'User-Agent':'Yaroslavplaksii'}//заголовок
    };

   const req = https.get(options,res=>{
        //console.log(res.statusCode, res.statusMessage);

        //res.on('data',data=>console.log(data.toString()));

        // res.setEncoding('utf-8');
        // res.on('data',data=>console.log(data));

        // res.setEncoding('utf-8');
        // res.on('data',data=>console.log(data.length));
       res.setEncoding('utf-8');

       if(res.statusCode ===200){
            let body = '';
            res.on('data',data=>body+=data);
            res.on('end',()=>{
                try{
                    const result = JSON.parse(body);
                    done(null,result);
                }catch(error){
                    done(new Error(`No valid format ${error.message}`));
                }

            });
       }else{
           done(new Error(`Error system ${res.statusCode}, ${res.statusMessage}`));
       }
    });
   req.on('error',error=>done(new Error(`Error send message (${error.message})`)));
}

module.exports = {
    getRepos
};