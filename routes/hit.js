var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var privatekey = config.jwt;

module.exports = function (Hit) {
  router.post('/', function (req, res, next) {
    var userinfo;
    if (req.headers['authorization']) {
      var str = req.headers['authorization'].substring(7);
      var decoded = jwt.decode(str);
      if (decoded != null) {
        userinfo = {
          id: decoded['_id'],
        }
      } else {
        userinfo = {
          id: '',
        }
      }

    }
    var ip = req.connection.remoteAddress;
    var data = {
      ip: ip,
      userinfo
    }
    Hit.Create(data, function (err, data) {
      if (err) {
        res.status(400).send({
          error: err.message
        });
      } else {
        res.status(200).send({
          success: true,
          results: data
        });
      }
    });
  });


  

  return router;
}