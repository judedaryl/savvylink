var router = require('express').Router();


module.exports = function (Organization, Contact, User) {
router.delete('/', function (req,res,next) {
    console.log(req.body);
    Organization.RemoveContribute(req.body, function (err, org) {
        if (err) {
            res.status(400).send({error: err.message});
        } else {
            Contact.RemoveWithOrg(req.body, function(errs, con) {
                if(err) res.status(400).send({error: errs.message});
                else res.status(200).send({success: true});
            });           
        }
    });
});


return router;
}