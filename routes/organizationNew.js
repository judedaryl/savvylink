var router = require('express').Router();

module.exports = function (Organization, Contact, User) {
router.post('/', function (req,res,next) {
    Organization.Create(req.body, function (err, org) {
        if (err) {
            res.status(400).send({error: err.message});
        } else {
            res.status(200).send({success: true});
        }
    });
});

return router;
}