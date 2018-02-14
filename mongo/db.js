const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/userColectionDB';

let users = [{name:"Steve",last:"Jobs",age:35},{name:"Bill",last:"Gaits",age:45},{name:"Bob",last:"Marlin",age:55}];
MongoClient.connect(url, (error, client) => {
    if (error) throw error;

    const db = client.db('users');

    // let user = {name: "Ivan", last: "Poroh", age: 55};
    //
    // db.collection("users").insertOne(user, (error, result) => {
    //     if (error) return console.log(error);
    //
    //     console.log(result.ops);
    // });



    // let cursor = db.collection("users").find();
    // cursor.toArray((error,res)=>{
    //     console.log(res);
    // });

    // db.collection("users").find({name:"Petro"}).toArray((error,res)=>{
    //     if(error) throw error;
    //     console.log(error);
    // });

    // db.collection("users").findOne({age:{$lt:30}}).then((res)=>{
    //     console.log(res);
    // });





    /*
    db.collection("users").find().toArray((error,res)=>{
        console.log(res);
    });

    // db.collection("users").deleteOne({name:"Ivan",age:55},(error,res)=>{
    //     if(error) throw error;
    //
    //     console.log(res);
    //
    //     db.collection("users").find().toArray((error,res)=>{
    //         console.log(res);
    //     });
    //
    // });

    db.collection("users").deleteMany({name:"Ivan",age:55},(error,res)=>{
        if(error) throw error;

        console.log(res);

        db.collection("users").find().toArray((error,res)=>{
            console.log(res);
        });

    });*/

    db.collection("users").insertMany(users,(errors,res)=>{

        if(error) throw error;

        db.collection("users").findOneAndUpdate(
            {age:55},
            {$set:{age:45}},

            {returnOriginal:false},

            (error,res)=>{
                if(error) throw error;
                console.log(res);
            }
        );
        client.close();
    });
});

// var mongoClient = require("mongodb").MongoClient;
//
// var users = [{name: "Bob", age: 34} , {name: "Alice", age: 21}, {name: "Tom", age: 45}];
// var url = "mongodb://localhost:27017/";
// mongoClient.connect(url, function(err, client){
//  if(error) throw errors;
//     const db = client.db('usersdb');
//     db.collection("users").insertMany(users, function(err, results){
//
//         console.log(results);
//         client.close();
//     });
// });