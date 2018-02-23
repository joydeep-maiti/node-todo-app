const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema( {
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true
        }
    }]

});

UserSchema.methods.generateAuthToken = function () {
    access = 'auth';
    token = jwt.sign({_id:this._id.toHexString(), access}, 'abc123').toString();
    // console.log(token);
    this.tokens.push({access, token});
    // console.log(this);
    // return this;
    return this.save().then(()=> {
        return token;
    });
};

var User = mongoose.model('Users', UserSchema); 
module.exports = {User};