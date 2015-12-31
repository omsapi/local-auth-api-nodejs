var express = require('express');
var tempAccessToken = require('../middleware/temp-access-token-mw');

var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    //Get ???
    router.get('/',
        passport.authenticate('access-token', {session: false}),
        function (req, res) {
            res.sendStatus(200);
        }
    );

    router.post('/signup', [
        passport.authenticate('local-signup', {session: false}),
        tempAccessToken.create,
    ], function (req, res, next) {
        res.status(201);
        res.send({
            tempAccessToken: res.locals.tempAccessToken
        });
    });

    router.post('/signin', [
        passport.authenticate('local-signin', {session: false}),
        tempAccessToken.create,
    ], function (req, res, next) {
        res.send({
            tempAccessToken: res.locals.tempAccessToken
        });
    });

    // Delete email membership
    router.delete('/',
        //passport.authenticate('access-token', {session: false}),
        function (req, res, next) {
            res.sendStatus(200);
        });

    return router;
};