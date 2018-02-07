var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var privatekey = config.jwt;

router.get('/userinfo', function(req, res, next) { 
    if(req.headers['authorization']){
        var str = req.headers['authorization'].substring(7);

        
        var decoded = jwt.decode(str);
        var userinfo = {
            id: decoded['_id'],
            username: decoded['username'],
            email: decoded['email'],
            name: decoded['name'],
            photo: decoded['photo'],
        }
        res.send(userinfo);
    }    
});


router.get('/tokenexpire', function(req,res,next) {
    if(req.headers['authorization']){
        var str = req.headers['authorization'].substring(7);
        jwt.verify(str, privatekey, function(err,decoded) {
            if(err){
                res.send(err);
            } else res.send(decoded);
        })
    }
})


module.exports = router;
