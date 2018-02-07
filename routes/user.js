var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* POST /api/register/ */
router.post('/login', function (req, res, next) {
    User.getAuthenticated(req.body, function (err, token) {
        if (err) {
            console.log(err.message);
            res.status(400).send({ status: 'bad', data: err.message });
        } else {
            res.send({ status: 'ok', data: token });
        }
    });
});

/* POST /api/register/ */
router.post('/register', function (req, res, next) {

    User.Create(req.body, function (err, user) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true });
        }
    });

});

router.get('/checkemail', function (req, res, next) {
    console.log(req.query);
    User.CheckEmail(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            if (results[0] != null) {
                res.status(200).send({ success: true })
            } else { res.status(200).send({ success: false }) }
        }
    });
});

router.get('/checkusername', function (req, res, next) {
    console.log(req.query);
    User.CheckUsername(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            if (results[0] != null) {
                res.status(200).send({ success: true })
            } else { res.status(200).send({ success: false }) }
        }
    });
});

module.exports = router;