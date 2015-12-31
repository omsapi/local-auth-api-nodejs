var jwt = require('jsonwebtoken');
var config = require('omsapi-config');

exports.create = function (req, res, next) {
    var user = req.user;

    var tempAccessPayload = createTempAccessPayload(user);
    res.locals.tempAccessToken = createTempAccessToken(tempAccessPayload);
    next();
};

//exports.verify = function (tokenName) {
//    return function (req, res, next) {
//        jwt.verify(req.body[tokenName], config.get('token:tempAccessSecret'), function (err, payloud) {
//            if (err)
//                return next(err);
//
//            req.tokens = req.tokens || {};
//            req.tokens[tokenName] = payloud;
//
//            next();
//        });
//    };
//};

function createTempAccessPayload(user) {
    return {
        userId: user._id
    };
}

function createTempAccessToken(payload) {
    var tempPasssSecret = config.get("token:tempAccessSecret");
    var tempPassTimeout = config.getInt("token:tempAccessTimeout");
    return jwt.sign(payload, tempPasssSecret, {expiresIn: tempPassTimeout});
}