var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');

var User = require('../../models/user');

module.exports = function (passport) {
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        email = email.toLowerCase();
        User.findOne({'memberships.provider': 'email', 'memberships.email': email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, false);
            } else {
                var newUser = new User();

                newUser.generateHash(password, function (err, hash) {
                    if (err) {
                        return done(err);
                    }

                    var membership = {
                        provider: 'email',
                        email: email,
                        password: hash,
                        created: moment.utc()
                    };
                    newUser.memberships.push(membership);

                    newUser.save(function (err) {
                        if (err) {
                            return done(err);
                        }

                        return done(null, newUser);
                    });
                });
            }
        });
    }));

    passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        email = email.toLowerCase();
        User.findOne({'memberships.provider': 'email', 'memberships.email': email}, {'memberships.$': 1}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            user.validatePassword(password, function (err, isValid) {
                if (err)
                    return done(err);

                if (isValid) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        });
    }));
};