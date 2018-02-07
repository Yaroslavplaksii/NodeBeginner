const fs = require('fs');
const stream = fs.createReadStream('./lorem.txt','utf-8');

let data = '';

stream.on('data',part=>data +=part);
stream.on('end',()=>console.log('End',data.length));//в обєкта є подія data, завершення читання
stream.on('error',error=>console.log('Error',error.message));//в обєкта є подія error, яка містить інфу про помилки