const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = function (token) {

    try {
        var decoded = jwt.verify(token, 'abc123');
        console.log('Verified');
    } catch (error) {
        console.log('rejected');
        return Promise.reject('invalid token');
    }

    return this.findOne({
        '_id': decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    });
    
};

UserSchema.pre('save', function(next) {
    if(this.isModified('password')) {
        var user = this;
        var password = user.password;
        console.log('hashing:', password);
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash('password', salt, function(err, hash) {
                console.log('hashed:', hash);
                user.password = hash;
                next();
                
            });
        });
    }
    else {
        next();
    }
})
var User = mongoose.model('Users', UserSchema); 
module.exports = {User};