const fs = require('fs');
const input = fs.createReadStream('./lorem.txt','utf-8');
const output = fs.createWriteStream('lorem.md');

input.on('data',part=>output.write(part));

input.on('error',error=>console.log('Error',error.message));