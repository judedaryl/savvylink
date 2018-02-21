var router = require('express').Router();
var ObjectID = require('mongodb').ObjectID;

module.exports = function (Organization, Contact, User) {
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
    Contact.RetrieveByOrganization(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});

router.get('/get/org/contribution', function (req, res, next) {
    Contact.RetrieveByOrganizationContribution(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});

router.get('/get/usesrs', function (req, res, next) {
    Contact.RetrieveByUser2(req.query, function (err, results) {
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
            res.status(200).send({ success: true, result: results });
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

return router;
}