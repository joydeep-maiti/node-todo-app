// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if(err) {
        return console.log('Unable to connect to Mongodb server:', err);
    }
    console.log('Connected to Mongodb server');


    db.collection('Users').insertOne({
        name : 'Joydeep',
        age : 21,
        location : 'kolkata'
    }, (err, res)=> {
        if(err) {
            return console.log('Error:', err);
        }
        console.log(JSON.stringify(res.ops), undefined, 2);
    });

    db.collection('Todos').insertOne({
        text: 'homework',
        completed: false
    }, (err, res) => {
        if (err) {
            return console.log('Error:', err);
        }
        console.log(res.ops);
    });
    db.close();
});