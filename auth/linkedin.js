var LinkedInStrategy = require('passport-linkedin').Strategy;
var Users = require('../models/user');
var config = require('../config/config');
var session = require('express-session');
var jsonwebtoken = require('jsonwebtoken');

module.exports = function(app, passport) {
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({secret: config.jwt, resave: false, saveUninitialized: true, cookie: {secure: false}}));


    passport.serializeUser(function(user, done) {       
        token = jsonwebtoken.sign({
            'username': user.username,
            'email': user.email, 
            'name' : user.name,
            'photo': user.photo,
            '_id': user._id,
            }, 
            config.jwt, 
            {
            expiresIn: config.jwtexpire // 1 hour
            });

        done(null,user.id);      
        
    });
      
    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err,user) {
            done(err,user);
        })
    });

    trya = '';
    passport.use(new LinkedInStrategy({
        consumerKey: config.linkedinAppID,
        consumerSecret: config.linkedinAppSecret,
        callbackURL: "http://localhost:3000/auth/linkedin/callback",
        profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url']
        },
        function(accessToken, refreshToken, profile, done) {
            var li = profile._json;                      
            
            Users.findOne({ linkedin_id: li.id  }, function(err,user){

                if(err) done(err);
                if(user && user != null){
                    done(null,user);
                } else {
                    
                    console.log(li.id);
                    var userdata = {
                        username: li.id+'li',
                        email: li.emailAddress,
                        name: li.firstName,
                        password: li.id,
                        photo: li.pictureUrl,
                        linkedin_id: li.id,
                    }
                    
                      Users.Create(userdata, function (err, user) {
                        if (err) {
                            done(err);
                        } else {
                            done(null, user)
                        }
                    });

                }
            });

            
            
            

            
        }
    ));

    app.get('/auth/linkedin/callback', passport.authenticate('linkedin',{ failureRedirect: config.linkedinFailRedirect }),
    function(req,res) {
        res.redirect(config.linkedinSuccessRedirect.concat(token));
    });
    app.get('/auth/linkedin',
    passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));

    return passport;
}