const config = require('../config/config');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const privatekey = config.jwt;
const SALT_FACTOR = 12;

module.exports = function (mongoose){
    const conn = mongoose.connection;
    var User = new mongoose.Schema({
        username: { type: String, required: true },
        facebook_id: { type: String, required: false },
        linkedin_id: { type: String, required: false },
        github_id: { type: String, required: false },
        google_id: { type: String, required: false },
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        photo: { type: String, required: false },
    }, { collection: 'users', strict: false });
    
    User.pre('save', function (next) {
        var user = this;
        if (!user.isModified('password')) return next();
        bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    });
    
    User.post('save', function (next) {
        console.log('post saving');
    });
    
    User.methods.comparePassword = function (compare, callback) {
        bcrypt.compare(compare, this.password, function (err, isMatch) {
            if (err) return callback(err);
            return callback(null, isMatch);
        });
    };
    
    User.statics.getAuthenticated = function (u, callback) {
        this.findOne({
            $or: [
    
                { email: u.email },
            ]
        }, function (err, doc) {
    
            if (err) {
                console.log(err);
                return callback(err);
            }
    
            // check if user is registered
            else if (!doc) {
                console.log('User not found');
                return callback(new Error('Not registered', 401), null);
            }
    
            else {
                // compare password
                doc.comparePassword(u.password, function (err, isMatch) {
                    if (err) return callback(err);
                    if (isMatch) {
                        var userdata = {
                            username: doc.username,
                            name: doc.name,
                            email: doc.email,
                            _id: doc._id,
                            photo: doc.photo,
                        }
    
                        var token = jsonwebtoken.sign(userdata, privatekey, {
                            expiresIn: config.jwtexpire // 1 hour
                        });
                        return callback(null, token);
                    }
                    else {
                        return callback(new Error('Invalid credentials'), null);
                    }
                });
            }
        });
    };
    
    User.statics.CheckEmail = function (query, callback) {
        var model = mongoose.model('users', User);
        model.find({ email: query.email }, function (err, results) {
            if (err) return callback(err);
            return callback(null, results);
        });
    };
    
    User.statics.CheckUsername = function (query, callback) {
        var model = mongoose.model('users', User);
        console.log(query.uname);
        model.find({ username: query.uname }, function (err, results) {
            if (err) return callback(err);
            console.log(results);
            return callback(null, results);
        });
    };
    
    User.statics.Create = function (u, callback) {
        if (u.name == null) { u.name = u.firstname + ' ' + u.lastname }
        this.findOne({
            $or: [
                { username: u.username },
                { email: u.email },
            ]
        }, function (err, doc) {
            if (err) return callback(err);
            if (doc) {
                console.log('Account already exists');
                return callback(new Error('Account already exists'), null);
            } else {
                if (u.photo == null) { u.photo = config.registrationImage; }
                var model = mongoose.model('users', User);
                var newUser = model({
                    username: u.username,
                    name: u.name,
                    password: u.password,
                    email: u.email,
                    photo: u.photo,
                    facebook_id: u.facebook_id,
                    linkedin_id: u.linkedin_id,
                    google_id: u.google_id,
                    github_id: u.github_id,
                });
    
                newUser.save(function (err) {
                    if (err) return callback(err);
                    return callback(null, newUser);
                });
    
            }
        });
    }
    
    
    
    return mongoose.model('User', User);
}


