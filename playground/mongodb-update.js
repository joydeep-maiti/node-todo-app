const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if(err) {
        return console.log('Unable to connect to Mongodb server:', err);
    }
    console.log('Connected to Mongodb server');

    db.collection('Todos').findOneAndUpdate({ 
        _id: new ObjectID('5a7c7be1c2cd8e03dc5ab86a')
    }, {
            $set: {
                completed : true
            }
    }, {
            returnOriginal  : false
    }).then((docs)=> {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err)=> {
        console.log('Unable to fetch data');
    });

    db.collection('Users').findOneAndUpdate({
        name: 'Joydeep'
    }, {
            $inc: {
                age: -2
            }
        }, {
            returnOriginal: false
        }).then((docs) => {
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch data');
        });
    // db.close();
});