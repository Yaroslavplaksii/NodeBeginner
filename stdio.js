const stdin = process.stdin;
const stdout = process.stdout;

//stdout.write('Hello node');

//stdin.on('data',data => stdout.write(data));

stdout.write('Enter your name ');
stdin.on('data',input=>{
   const name = input.toString().trim(); 
   const revercename = name.split('').reverse().join('');
   stdout.write(`\n${name}, reverse name ${revercename}`);
   process.exit();
});
process.on('exit',()=>{
    stdout.write('\n\n\n Let go go');
});