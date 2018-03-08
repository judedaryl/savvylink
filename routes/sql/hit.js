var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var privatekey = config.jwt;
var HitModel = require('../../models/sql/hit');

module.exports = function () {

    router.post('/', (req, res, next) => {
        var userid;
        if (req.headers['authorization']) {
            var str = req.headers['authorization'].substring(7);
            var decoded = jwt.decode(str);
            if (decoded != null) {
                userid = parseInt(decoded['_id'], 10);
            } else {
                userid = 0;
            }
        }

        var ip = req.connection.remoteAddress;
        var data = {
            ip: ip,
            userid: userid
        }

        HitModel.hit(data, (err, resp) => {
            if(err) res.status(400).send({error: err});
            else {
                if(resp) {
                    HitModel.counthits(null, (err, resp) => {
                        if(err) res.status(400).send({error: err});
                        else {
                            res.status(200).send({
                                success: true,
                                results: {
                                    count: resp
                                }
                            });
                        }
                    });
                }
            }
        })
    })

    return router;
}