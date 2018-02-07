var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/username', function (req, res, next) {
    console.log(req.query);
    User.find({ username: req.query.username }, { 'id': 1, 'username': 1, 'email': 1, 'name': 1 }, function (err, document) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: document });
        }
    });
});

router.get('/find', (req, res, next) => {

    User.find({
        $or: [
            { name: { $regex: req.query.query, $options: 'i' } },
            { email: { $regex: req.query.query, $options: 'i' } },
        ]
    }, { 'username': 1, 'email': 1, 'name': 1 }, (err, doc) => {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: doc });
        }
    }).lean();
});

module.exports = router;