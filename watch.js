const fs = require('fs');

// fs.watch(__dirname,(event,filename)=>{
//     console.log(event);
//     console.log(filename);
// });

const watcher = fs.watch(__dirname,(event,filename)=>{
        console.log(event);
console.log(filename);
});
watcher.on('error',error=>console.log(erorr));