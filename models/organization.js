module.exports = function (mongoose) {

    var Organization = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false
        },
        address_1: {
            type: String,
            required: false
        },
        address_2: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        user: {
            user_id: {
                type: String,
                required: false
            },
            username: {
                type: String,
                required: false
            },
            displayname: {
                type: String,
                required: false
            },
        },
        contributors: [],
    }, {
        collection: 'organizations',
        strict: false
    });

    Organization.pre('save', function (next) {
        var org = this;
        next();
    });

    Organization.post('save', function (next) {
        console.log('organization saved');
    });

    Organization.statics.Create = function (org, callback) {
        if(org.type == 'null') { org.type = ''; }
        if(org.address_1 == 'null') { org.address_1 = ''; }
        if(org.address_2 == 'null') { org.address_2 = ''; }
        var model = mongoose.model('organizations', Organization);
        var newOrg = model({
            name: org.name,
            type: org.type,
            address_1: org.address_1,
            address_2: org.address_2,
            city: org.city,
            province: org.province,
            country: org.country,
            user_id: org.user_id,
            user: {
                user_id: org.user_id,
                username: org.user_username,
                displayname: org.user_displayname,
            },
        });

        newOrg.contributors.push({
            _id: org.user_id,
            username: org.user_username,
            displayname: org.user_displayname
        });
        newOrg.save(function (err) {
            if (err) return callback(err);
            return callback(null, newOrg);
        });
    }

    Organization.statics.RetrieveAll = function (callback) {
        var model = mongoose.model('organizations', Organization);
        model.find(function (err, results) {
            if (err) return callback(err);
            return callback(null, results);
        }).lean();
    };

    Organization.statics.Retrieve2 = function (query, callback) {
        var model = mongoose.model('organizations', Organization);
        if (query.query == '') {
            model.find({}, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
        } else {
            model.find({
                $or: [{
                        name: {
                            $regex: query.query,
                            $options: 'i'
                        }
                    },
                    {
                        city: {
                            $regex: query.query,
                            $options: 'i'
                        }
                    },
                    {
                        province: {
                            $regex: query.query,
                            $options: 'i'
                        }
                    },
                    {
                        country: {
                            $regex: query.query,
                            $options: 'i'
                        }
                    }
                ]
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
        }



    };
    var async = require('async');
    Organization.statics.Retrieve = function (query, callback) {
        var model = mongoose.model('organizations', Organization);
        sort = (query.sort == undefined) ? 'name' : query.sort;
        offset = (query.offset == undefined) ? 0 : query.offset;
        limit = (query.limit == undefined) ? 10 : query.limit;
        limit = parseInt(limit);
        offset = parseInt(offset);
        order = (query.order == undefined) ? 'asc' : query.order;
        search = (query.search == undefined) ? '' : query.search;
        var countquery = function (callback) {
            model.find({}, function (err, results) {
                if (err) return callback(err);
                else {
                    return callback(null, results.length);
                }
            });
        }
        var actualquery_count = function (callback) {
            model.find({
                $or: [{
                        name: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        city: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        province: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        country: {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ]
            }, function (err, results) {
                if (err) return callback(err);
                else {
                    return callback(null, results);
                }
            }).lean();
        }

        var actualquery = function (callback) {
            model.find({
                $or: [{
                        name: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        city: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        province: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        country: {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ]
            }, function (err, results) {
                if (err) return callback(err);
                else {
                    return callback(null, results);
                }
            }).lean().skip(offset).limit(limit).sort({
                [sort]: order
            });
        }

        async.parallel([countquery, actualquery, actualquery_count], function (err, results) {
            if (err) return callback(err);
            else return callback(null, {
                count: results[0],
                filtered: results[2].length,
                data: results[1]
            })
        });
    };

    Organization.statics.RetrieveByContribution = function (query, callback) {
        var model = mongoose.model('organizations', Organization);
        sort = (query.sort == undefined) ? 'name' : query.sort;
        offset = (query.offset == undefined) ? 0 : query.offset;
        limit = (query.limit == undefined) ? 10 : query.limit;
        limit = parseInt(limit);
        offset = parseInt(offset);
        order = (query.order == undefined) ? 'asc' : query.order;
        search = (query.search == undefined) ? '' : query.search;
        var countquery = function (callback) {
            model.find({
                'contributors._id': query.user_id
            }, function (err, results) {
                if (err) return callback(err);
                else {
                    return callback(null, results.length);
                }
            });
        }
        var actualquery = function (callback) {
            model.find({
                'contributors._id': query.user_id,
                $or: [{
                        name: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        city: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        province: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        country: {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ]
            }, function (err, results) {
                if (err) return callback(err);
                else {
                    return callback(null, results);
                }
            }).lean().skip(offset).limit(limit).sort({
                [sort]: order
            });
        }

        var actualquery_count = function (callback) {
            model.find({
                'contributors._id': query.user_id,
                $or: [{
                        name: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        city: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        province: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        country: {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ]
            }, function (err, results) {
                if (err) return callback(err);
                else {
                    return callback(null, results);
                }
            }).lean();
        }

        async.parallel([countquery, actualquery, actualquery_count], function (err, results) {
            console.log('counter', results[1]);
            if (err) return callback(err);
            else return callback(null, {
                count: results[0],
                filtered: results[2].length,
                data: results[1]
            })
        });
    };

    var ObjectID = require('mongodb').ObjectID;

    Organization.statics.RetrieveByID = function (query, callback) {
        var objid = new ObjectID(query.id);
        var model = mongoose.model('organizations', Organization);
        model.find({
            _id: objid
        }, function (err, results) {
            if (err) return callback(err);
            return callback(null, results);
        }).lean();
    };


    Organization.statics.RetrieveByUserID = function (query, callback) {
        var model = mongoose.model('organizations', Organization);
        if (query.query == '') {
            model.find({
                user_id: query.user_id
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
        } else {
            model.find({
                $or: [{
                        name: {
                            $regex: query.query,
                            $options: 'i'
                        }
                    },
                    {
                        city: {
                            $regex: query.query,
                            $options: 'i'
                        }
                    },
                    {
                        province: {
                            $regex: query.query,
                            $options: 'i'
                        }
                    },
                    {
                        country: {
                            $regex: query.query,
                            $options: 'i'
                        }
                    }
                ],
                user_id: query.user_id
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
        }
    };


    Organization.statics.Remove = function (query, callback) {
        var objid = new ObjectID(query.id);

        var model = mongoose.model('organizations', Organization);
        model.remove({
            _id: objid
        }, function (err) {
            if (err) return callback(err);
            return callback(null);
        }).lean();
    };

    Organization.statics.RemoveContribute = function (query, callback) {
        var objid = new ObjectID(query.id);

        var model = mongoose.model('organizations', Organization);
        model.update({
            _id: objid, 'contributors._id': query.user_id,
        }, {$pull: {
            contributors: {_id: query.user_id}
        }},function (err) {
            if (err) return callback(err);
            return callback(null);
        }).lean();
    };

    Organization.statics.Checkname = function (query, callback) {
        var model = mongoose.model('organizations', Organization);
        model.find({
            name: query.name
        }, function (err, results) {
            if (err) return callback(err);
            return callback(null, results);
        }).lean();
    };

    Organization.statics.Modify = function (query, callback) {
        var objid = new ObjectID(query.id);
        var q = {
            'name': query.name,
            'address_1': query.address_1,
            'address_2': query.address_2,
            'type': query.type,
            'city': query.city,
            'province': query.province,
            'country': query.country,
        };
        var model = mongoose.model('organizations', Organization);
        model.update({
            _id: objid,
            user_id: query.user_id
        }, q, function (err, raw) {
            if (err) return callback(err);
            return callback(null);
        }).lean();
    };

    Organization.statics.Contribute = function (query, callback) {
        var objid = new ObjectID(query.id);
        var model = mongoose.model('organizations', Organization);

        model.update({
            _id: objid
        }, {
            $push: {
                contributors: {
                    _id: query.user_id,
                    username: query.user_username,
                    displayname: query.user_displayname
                }
            }
        }, function (err, raw) {
            if (err) return callback(err);
            return callback(null);
        });

    }

    return mongoose.model('organizations', Organization);
}