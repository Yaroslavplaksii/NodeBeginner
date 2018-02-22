const connection = require('./config');
connection.connect();
function findOne(email,done){
    connection.query('SELECT * FROM users WHERE name=? ',[email.email],(data)=>{
        if(data){
            return  data;
        }
    });
}
