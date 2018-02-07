var router = require('express').Router();
var Organization = require('../models/organization');

router.put('/', function (req,res,next) {
    Organization.Modify(req.body, function (err) {
        if (err) {
            res.status(400).send({error: err.message});
        } else {
            res.status(200).send({success: true});
        }
    });
});

module.exports = router;