const fs = require('fs');

const command = process.argv[2];
const title = process.argv[3];
const content = process.argv[4];

switch(command){
    case 'list':
        list((error,notes)=>{
            if(error) return console.error(error.message);
            notes.forEach((note,index)=>console.log(`${index+1},${note.title}`));
        });
        break;
    case 'view':
        view(title,(error,notes)=>{
            if(error) return console.error(error.message);
            notes.forEach((note,index)=>console.log(`${note.title}\r\n\r\n-----\r\n\r\n${note.content}`));
        });
        break;
    case 'create':
        create(title,content,error=>{
            if(error) return console.log(error.mssage);            
            console.log("Notes is created");
        });
        break;
    case 'destroy':
        destroy(title,error=>{
             if(error) return console.log(error.mssage);            
             console.log("Notes is delete");
        });
        break;
    default:
        console.log('No command');
}
function list(done){
    fs.readFile('notes.json',(error,data)=>{
        if(error) return done(error);
        const notes = JSON.parse(data);
       done(null,notes);
    });
}
function view(title,done){
    fs.readFile('notes.json',(error,data)=>{
        if(error) return done(error);
        const notes = JSON.parse(data);
        const note = notes.find(note=>note.title === title);
        if(!note)return done(new Erorr("no found"));
        done(null,notes);
});
}
function create(title,content,done){
    fs.readFile('notes.json',(error,data)=>{
        if(error) return done(error);    
        const notes = JSON.parse(data);
        notes.push({title,content});
        const json = JSON.stringify(notes);
        
        fs.writeFile('notes.json',json,error=>{
            if(error) return done(error);
        });
        done();
    });
}
function destroy(title,done){
    fs.readFile('notes.json',(error,data)=>{
        if(error) return done(error);    
        let notes = JSON.parse(data);
        notes = notes.filter(note=>note.title !== title);      
        
        fs.writeFile('notes.json',notes,error=>{
            if(error) return done(error);
        });
        done();
    });
}