const fs = require('fs');
const zlib = require('zlib');//бібліотека роботи  зі стисненням (архіватор)

const input = fs.createReadStream('./lorem.txt');//читаємо поток
const output = fs.createWriteStream('lorem2.md.gz');//записуємо поток
const gzip = zlib.createGzip();
input.pipe(gzip).pipe(output);//метод можна багато разів викликати

class ReadStream{
    pipe(stream){
        this.on('data',parts =>  stream.write(part));
        return stream;
    }
}
