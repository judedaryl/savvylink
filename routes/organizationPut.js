var router = require('express').Router();

module.exports = function (Organization, Contact, User) {
router.put('/', function (req,res,next) {
    Organization.Modify(req.body, function (err) {
        if (err) {
            res.status(400).send({error: err.message});
        } else {
            res.status(200).send({success: true});
        }
    });

    Contact.UpdateFromOrg(req.body);
});

router.put('/contribute', function(req,res,next) {
    Organization.Contribute(req.body, function(err) {
        if (err) {
            res.status(400).send({error: err.message});
        } else {
            res.status(200).send({success: true});
        }
    });
});

return router;
}