const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');
var app = express();
app.use(bodyParser.json());

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');
const {authenticate} = require('./middlewares/authenticate');

const port = process.env.PORT || 3000;

app.post('/todos', authenticate, (req, res)=> {
    console.log(req.body);
    var newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res)=> {
    Todo.find({_creator:req.user._id}).then((todos)=> {
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

app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
        res.send('Invalid id');
        return;
    }
    Todo.findOne({_id:id, _creator:req.user._id}).then((todos) => {
        if(!todos) {
            res.send('Id not matched');
            return;
        }
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
        res.send('Invalid id');
        return;
    }
    Todo.findOneAndRemove({ _id: id, _creator: req.user._id }).then((todos) => {
        if (!todos) {
            res.send('Id not matched');
            return;
        }
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    })
})

app.patch('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    // console.log(body);
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
    // console.log(body);
    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, body, {new:true}).then((todos) => {
        if (!todos) {
            res.send('Id not matched');
            return;
        }
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    })
});

app.post('/users', (req, res) => {
    var newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    newUser.save().then((req, res) => {
        // console.log('newuser pass :',newUser.password);
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
    }).catch((e) => {
            res.status(400).send(e.errmsg);
        });
});

app.get('/users/me', authenticate, (req, res)=> {
    res.send(req.user);
});

app.post('/users/login', (req, res)=> {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    User.findOne({email}).then((user)=> {
        bcrypt.compare(password, user.password, (err, val)=> {
            if(val) {
                return user.generateAuthToken().then((token)=> {
                    res.header('x-auth', token).send(user);
                })
            }
            else {
                res.status(400).send('Wrong password');
            }
        })
    }).catch((e)=> {
        res.status(400).send(e);
    })
});

app.delete('/users/me/token', authenticate, (req, res)=> {
    req.user.removeToken(req.token).then(()=> {
        res.status(200).send();
    }, ()=> {
        res.status(400).send();
    })
})
app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
});