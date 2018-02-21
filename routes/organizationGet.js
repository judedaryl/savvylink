var router = require('express').Router();
var ObjectID = require('mongodb').ObjectID;

module.exports = function (Organization, Contact, User) {
    
router.get('/all', function (req, res, next) {
    
    Organization.RetrieveAll(function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });
        }
    });
});

router.get('/old', function (req, res, next) {
    Organization.Retrieve2(req.query, function (err, results) {
        if (err) {
            console.log(err);
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
            res.send({ success: true, result: results });         
        }
    });
});

router.get('/contribution', function(req,res,next) {
    Organization.RetrieveByContribution(req.query, function (err, results) {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.status(200).send({ success: true, result: results });         
        }
    });
})

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

return router;
}