var express = require('express');
var router = express.Router();

var UserModel = require('../../models/sql/user');

module.exports = function () {

    router.post('/login', (req, res, next) => {
        UserModel.login(req.body, (err, resp, unauth) => {
            if (err) res.status(400).send(err);
            else res.status(200).send(resp);
        });
    })
    router.post('/register', (req, res, next) => {
        UserModel.register(req.body, (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else res.status(200).send(resp);
        })
    });

    router.get('/checkemail', function (req, res, next) {
        UserModel.checkemail(req.query, (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                if (resp != 0) {
                    res.status(200).send({
                        success: true
                    })
                } else {
                    res.status(200).send({
                        success: false
                    })
                }
            }
        });
    });

    router.get('/checkusername', function (req, res, next) {
        UserModel.checkusername(req.query, (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                if (resp != 0) {
                    res.status(200).send({
                        success: true
                    })
                } else {
                    res.status(200).send({
                        success: false
                    })
                }
            }
        });
    });

    router.get('/count', (req,res,next) => {
        UserModel.count((err,resp) => {
            res.send(resp);
        });
    })

    return router;
}