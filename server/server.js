const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var Todo = mongoose.model('Todo', {
    text : {
        type : String
    },

    completed : {
        type : Boolean
    },

    completedAt : {
        type : Number
    }
});

var newTodo = new Todo({
    text : 'Eat breakfast',
    completed : true,
    completedAt : 8
});

newTodo.save().then((doc)=> {
    console.log('saved:', doc);
}, (e)=> {
    console.log('not saved', e);
});

var User = mongoose.model('Users', {
    name : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },

    email : {
        type : String,
        minlength : 1,
        required : true,
        trim : true 
    }
});

var newUser = new User({
    name : 'joydeep',
    email : 'abc@gamil.com'
});

newUser.save().then((doc) => {
    console.log('saved:', doc);
}, (e) => {
    console.log('not saved', e);
});