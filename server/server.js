const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
var app = express();
app.use(bodyParser.json());

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');

const port = process.env.PORT || 3000;

app.post('/todos', (req, res)=> {
    var newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/users', (req, res) => {
    var newUser = new User({
        name: req.body.name,
        email: req.body.email
    });

    newUser.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res)=> {
    Todo.find().then((todos)=> {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
    
});

// app.get('/users', (req, res) => {
//     User.find().then((users) => {
//         res.send({users});
//     }, (e) => {
//         res.status(400).send(e);
//     })
// });

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
        res.send('Invalid id');
        return;
    }
    Todo.findById(id).then((todos) => {
        if(!todos) {
            res.send('Id not matched');
            return;
        }
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
        res.send('Invalid id');
        return;
    }
    Todo.findByIdAndRemove(id).then((todos) => {
        if (!todos) {
            res.send('Id not matched');
            return;
        }
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    })
})

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    console.log(body);
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }
    if (!ObjectId.isValid(id)) {
        res.send('Invalid id');
        return;
    }
    console.log(body);
    Todo.findByIdAndUpdate(id, body, {new:true}).then((todos) => {
        if (!todos) {
            res.send('Id not matched');
            return;
        }
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    })
});


app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
});