const {User} = require('./../models/users');

var authenticate = (req, res, next)=> {
//    console.log('body',req);
    var token = req.header('x-auth');
    // console.log(token);
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(400).send(e);
    });
};

module.exports = {authenticate};