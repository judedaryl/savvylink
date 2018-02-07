var router = require('express').Router();
var Organization = require('../models/organization');
var User = require('../models/user');
var Contact = require('../models/contact');
var ObjectID = require('mongodb').ObjectID;
router.get('/all', function (req, res, next) {
    
    Organization.RetrieveAll(function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});

router.get('/', function (req, res, next) {
    Organization.Retrieve(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            var user_id_list = []
            results.forEach(org => {
                var obj = new ObjectID(org.user_id);
                user_id_list.push(obj);
                org.user = [];
            });
            User.find({ _id: { $in: user_id_list } }, (err, doc) => {
                if (err) {
                    res.status(400).send({ error: err.message });
                } else {
                    results.forEach(org => {
                        var thisuser = doc.find(x => x._id == org.user_id);
                        org.user.push({ name: thisuser.name, email: thisuser.email, username: thisuser.username });
                        org.user[0].contacts = [];
                    });
                    var org_id_list = [];
                    results.forEach(x => {
                        x.contacts = [];
                        org_id_list.push(x._id);
                    });
                    Contact.find({ org_id: { $in: org_id_list } }, (err, doc) => {
                        doc.forEach(con => {
                            results.find(x => x._id == con.org_id).contacts.push(con);
                        });
                        Contact.find({ user_id: { $in: user_id_list } }, (err, c) => {
                            
                            c.forEach(cn => {
                                results.forEach(or => {
                                    if(or.user_id == cn.user_id) {
                                        or.user[0].contacts.push(cn);
                                    }
                                })
                            });
                            res.status(200).send({ success: true, result: results });
                        });

                    });
                }
            });


        }
    });
});


router.get('/user', function (req, res, next) {
    Organization.RetrieveByUserID(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            var objid = new ObjectID(req.query.user_id);
            User.findOne({ _id: objid }, function (error, user) {
                if (error) {
                    res.status(400).send({ error: error.message });
                } else {
                    var org_id_list = [];
                    results.forEach(x => {
                        x.contacts = [];
                        org_id_list.push(x._id);
                    });


                    Contact.find({ org_id: { $in: org_id_list } }, (err, doc) => {
                        doc.forEach(con => {
                            results.find(x => x._id == con.org_id).contacts.push(con);
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

router.get('/byid', function (req, res, next) {
    if(req.query.query=='') {req.query.query = " "}
    Organization.RetrieveByID(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            var org_id_list = [];
            results.forEach(x => {
                x.contacts = [];
                org_id_list.push(x._id);
            });
            Contact.find({ org_id: { $in: org_id_list } }, (err, doc) => {
                doc.forEach(con => {
                    results.find(x => x._id == con.org_id).contacts.push(con);
                });

                res.status(200).send({ success: true, result: results });

            });
        }
    });
});

router.get('/checkname', function (req, res, next) {
    Organization.Checkname(req.query, function (err, results) {
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