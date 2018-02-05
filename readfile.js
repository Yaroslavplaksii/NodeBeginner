const fs = require('fs');

// const file = fs.readFile('test.txt',(error,data)=>{
//    if(error) throw error;
//    console.log(data.toString());
// });

function getValue(flag){
   const index = process.argv.indexOf(flag);
   return (index>-1)?process.argv[index+1]:null;
}
const filename = getValue('-f');
fs.readFile(filename,'utf-8',(error,data)=>{
        if(error)
           return console.log('File is not isset');
      console.log(data);
});