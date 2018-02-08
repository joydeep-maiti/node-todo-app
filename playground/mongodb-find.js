const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if(err) {
        return console.log('Unable to connect to Mongodb server:', err);
    }
    console.log('Connected to Mongodb server');

    db.collection('Users').find({ _id: new ObjectID('5a7c73532043761c9087b82e')}).toArray().then((docs)=> {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err)=> {
        console.log('Unable to fetch data');
    });
    // db.close();
});