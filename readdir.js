const fs = require('fs');

// const dir = fs.readdirSync(__dirname);
// console.log(dir);

console.log("Beging read dir");
fs.readdir(__dirname,(error,contents)=>{
    if(error)
        throw error;

console.log(contents);
});
console.log("End read dir");