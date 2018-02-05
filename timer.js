const waitTime = 3000;
const waitInterval = 100;
let currentTime = 0;

const stdout = process.stdout;
/*
stdout.write('Loading....');

setInterval(()=>{
    currentTime += waitInterval;
    stdout.write(currentTime.toString());
},waitInterval);

setTimeout(()=>{
    stdout.write('Is load');
    process.exit();
},waitTime);
*/
let persent = 0;
function print(persent){
    stdout.clearLine();
    stdout.cursorTo(0);
    stdout.write(`Loading....${persent}%`);
}


setInterval(()=>{
    currentTime += waitInterval;
    persent = Math.round(currentTime/waitTime*100);
    print(persent)
},waitInterval);

setTimeout(()=>{
    print(100);
    stdout.write('Is load');
    process.exit();
},waitTime);