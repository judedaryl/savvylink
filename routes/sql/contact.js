var express = require('express');
var router = express.Router();

ConModel = require('../../models/sql/contact');
module.exports = function (Organization, Contact, User) {

    router.get('/get', (req, res, next) => {
        ConModel.retrieve(req.query, 'getall', (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
            }
        })
    });

    router.get('/count', (req,res,next) => {
        ConModel.count((err,resp) => {
            res.send(resp);
        });
    })

    router.get('/get/byid', (req, res, next) => {
        ConModel.retrieve(req.query, 'con_id', (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
            }
        })
    });

    router.get('/get/org', (req, res, next) => {
        ConModel.retrieve(req.query, 'org_id', (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
            }
        })
    });

    router.get('/get/users', (req, res, next) => {
        ConModel.retrieve(req.query, 'user_id', (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
            }
        })
    });

    router.get('/get/org/contribution', (req, res, next) => {
        ConModel.retrieve(req.query, 'contribution', (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
            }
        })
    });
    
    router.post('/create', (req, res, next) => {
        ConModel.create(req.body, (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                res.status(200).send({
                    success: true
                });
            }
        });
    });

    router.put('/modify', (req, res, next) => {
        ConModel.modify(req.body, (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                res.status(200).send({
                    success: true
                });
            }
        });
    });

    router.delete('/remove', function (req, res, next) {
        ConModel.del(req.body, function (err) {
            if (err) {
                res.status(400).send({ error: err.message });
            } else {
                res.status(200).send({ success: true });
            }
        });
    });

    return router;
}