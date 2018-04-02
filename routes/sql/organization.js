var express = require('express');
var router = express.Router();

var OrgModel = require('../../models/sql/organization');
var ContributorModel = require('../../models/sql/contributor');
var ContactModel = require('../../models/sql/contact');
module.exports = function () {

    router.get('/get', (req, res, next) => {
        OrgModel.retrieve(req.query, 'getall' ,(err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {


                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
             }
        });
    });

    
    router.get('/get/all', (req, res, next) => {
        OrgModel.retrieve_(req.query, 'getall' ,(err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {


                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
             }
        });
    });

    router.get('/get/contribution', (req,res,next) => {
        OrgModel.retrieve(req.query, 'contribution' ,(err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
             }
        });
    });

    router.get('/get/user', (req,res,next) => {
        OrgModel.retrieve(req.query, 'user' ,(err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                var responseObject = {
                    success: true,
                    result: {
                        count: resp.total,
                        filtered: resp.result.length,
                        data: resp.result
                    }
                }
                res.status(200).send(responseObject);
             }
        });
    });

    router.get('/get/byid', (req,res,next) => {
        OrgModel.retrieve(req.query, 'org_id' ,(err, resp) => {
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

    router.get('/get/checkname', (req,res,next) => {
        OrgModel.retrieve(req.query, 'checkname' ,(err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else {
                var thereis = false;
                if(resp.result.length != 0) {
                    thereis = true;
                } 
                res.status(200).send({
                    success: thereis
                });
             }
        });
    });


    router.post('/create', (req, res, next) => {
        OrgModel.create(req.body, (err, resp) => {
            if (err) res.status(400).send({
                error: err
            });
            else res.status(200).send({
                success: true
            });
        });
    });

    router.delete('/remove', (req,res,next)=>{
        ContributorModel.delete(req.body, (err, resp)=> {
            if(err) res.status(400).send({error: err});
            else {
                ContactModel.removewithorg(req.body, (errs,resp) => {
                    if(err) res.status(400).send({error: errs.message});
                    else res.status(200).send({success: true});
                });
            }
        });
    });

    router.put('/modify', (req,res,next)=>{
        OrgModel.modify(req.body, (err, resp)=> {
            if(err) res.status(400).send({error: err});
            else res.status(200).send({success: true});
        });
    });

    router.put('/modify/contribute', (req,res,next)=>{
        ContributorModel.create(req.body, (err, resp)=> {
            if(err) res.status(400).send({error: err});
            else {
                if(resp == 1) res.status(200).send({success: true});
                else res.status(200).send({success: false});
            }
        });
    });

    return router;
}