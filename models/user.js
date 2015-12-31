var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
    memberships: [{
        provider: String,
        email: String,
        password: String,
        created: Date
    }]
});

userSchema.methods.generateHash = function (password, callback) {
    bcrypt.genSalt(8, function (err, salt) {
        bcrypt.hash(password, salt, null, function (err, hash) {
            callback(err, hash);
        });
    });
};

userSchema.methods.validatePassword = function (password, callback) {
    var curPassword = this.memberships[0].password;
    bcrypt.compare(password, curPassword, function (err, result) {
        callback(err, result);
    });
};

module.exports = mongoose.model('User', userSchema);