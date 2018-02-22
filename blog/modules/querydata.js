const mysql = require('mysql');

const connection = mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'blog'
});

connection.connect();

module.exports.selector = function (sql,callback){
    let all_categories;
    connection.query(sql, function(error, rows) {
        if(error) console.error('Error connect: ' + error.code);
        callback(rows);
    });
};
