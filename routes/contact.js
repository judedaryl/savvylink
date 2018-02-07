var router = require('express').Router();
var Contact = require('../models/contact');
var Organization = require('../models/organization');
var User = require('../models/user');
var ObjectID = require('mongodb').ObjectID;
router.get('/get/all', function (req, res, next) {
    Contact.RetrieveAll(function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});

router.get('/get', function (req, res, next) {
    Contact.Retrieve(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});

router.get('/get/byid', function (req, res, next) {
    Contact.RetrieveByID(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});


router.get('/get/org', function (req, res, next) {
    Contact.RetrieveByOrg(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});

router.get('/get/user', function (req, res, next) {
    Contact.RetrieveByUser(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});

router.get('/get/users', function (req, res, next) {
    Contact.RetrieveByUser(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            var user__id = req.query.user_id || '';
            var objid = new ObjectID(user__id);
            User.findOne({ _id: objid }, function (error, user) {
                if (error) {
                    res.status(400).send({ error: error.message });
                } else {
                    var org_id_list = [];

                    results.forEach(x => {
                        var org_id_obj = new ObjectID(x.org_id);
                        org_id_list.push(org_id_obj);
                    });

                    Organization.find({ _id: { $in: org_id_list } }, (err, doc) => {
                        results.forEach(contact => {
                            contact.orgname = doc.find(org => org._id == contact.org_id).name;
                        });

                        if (user.username != req.query.username) {
                            res.status(200).send({ success: true, user: false, result: results })
                        } else {
                            res.status(200).send({ success: true, user: true, result: results });
                        }
                    });
                }
            });
        }
    });
});




router.post('/create', function (req, res, next) {
    var user_id = new ObjectID(req.body.user_id);
    var org_id = new ObjectID(req.body.org_id);

    User.findOne({ _id: user_id }, (err, doc) => {
        if (!doc) {
            res.status(400).send({ error: 'User does not exists' });
        } else {
            Organization.findOne({ _id: org_id }, (err, doc) => {
                if (!doc) {
                    res.status(400).send({ error: 'Organization does not exists' });
                } else {
                    Contact.Create(req.body, function (err, org) {
                        if (err) {
                            res.status(400).send({ error: err.message });
                        } else {
                            res.status(200).send({ success: true });
                        }
                    });
                }
            })
        }
    })
});

router.delete('/remove', function (req, res, next) {
    Contact.Remove(req.body, function (err) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true });
        }
    });
});

router.put('/modify', function (req, res, next) {
    Contact.Modify(req.body, function (err) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true });
        }
    });
});
module.exports = router;