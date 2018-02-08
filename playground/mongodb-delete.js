const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if(err) {
        return console.log('Unable to connect to Mongodb server:', err);
    }
    console.log('Connected to Mongodb server');

    db.collection('Users').deleteOne({ name: 'Joydeep'}).then((res)=> {
        console.log(res);
    }, (err)=> {
        console.log('Unable to fetch data');
    });

    db.collection('Users').deleteMany({ name: 'Joydeep' }).then((res) => {
        console.log(res);
    }, (err) => {
        console.log('Unable to fetch data');
    });

    db.collection('Users').findOneAndDelete({ _id: new ObjectID('5a7c72de9e9d3008e85f848b') }).then((res) => {
        console.log(res);
    }, (err) => {
        console.log('Unable to fetch data');
    });
    // db.close();
});