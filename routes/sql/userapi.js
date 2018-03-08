var express = require('express');
var router = express.Router();

UserModel = require('../../models/sql/user');
module.exports = function (Organization, Contact, User) {

router.get('/find', (req, res, next) => {

    UserModel.finduser(req.query, (err, resp)=>{
        if (err) res.status(400).send({
            error: err
        });
        else {
            var responseObject = {
                success: true,
                result: resp.result
            }
            res.status(200).send(responseObject);
         }
    });
});

router.get('/username', (req, res, next) => {

    UserModel.username(req.query, (err, resp)=>{
        if (err) res.status(400).send({
            error: err
        });
        else {
            var responseObject = {
                success: true,
                result: resp.result
            }
            res.status(200).send(responseObject);
         }
    });
});

return router;
}