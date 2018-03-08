module.exports = function (mongoose) {

    
var Contact = new mongoose.Schema({
    name: { type: String, required: false },
    position: { type: String, required: true },
    contact: { type: String, required: false },
    org_id: { type: String, required: true },
    user_id: { type: String, required: true },
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
    organization: {
        org_id: {
            type: String,
            required: false
        },
        org_name: {
            type: String,
            required: false
        }
    }
}, { collection: 'contacts', strict: false });

Contact.pre('save', function (next) {
    var org = this;
    next();
});

Contact.post('save', function (next) {
    console.log('contact saved');
});

Contact.statics.Create = function (c, callback) {

    if(c.position == 'null') { c.position = ''; }
    if(c.name == 'null') { c.name = ''; }
    console.log(c);
    var model = mongoose.model('contacts', Contact);
    var newContact = model({
        name: c.name,
        position: c.position,
        org_id: c.org_id,
        user_id: c.user_id,
        contact: c.contact,
        user: {
            user_id: c.user_id,
            username: c.user_username,
            displayname: c.user_displayname,
        },
        organization: {
            org_id: c.org_id,
            org_name: c.org_name,
        }
    });

    newContact.save(function (err) {
        if (err) return callback(err);
        return callback(null, newContact);
    });
}

Contact.statics.RetrieveAll = function (callback) {
    var model = mongoose.model('contacts', Contact);
    model.find(function (err, results) {
        if (err) return callback(err);
        return callback(null, results);
    }).lean();
};


Contact.statics.Retrieve = function (query, callback) {
    var model = mongoose.model('contacts', Contact);
    sort = (query.sort == undefined) ? 'name' : query.sort;
    offset = (query.offset == undefined) ? 0 : query.offset;
    limit = (query.limit == undefined) ? 10 : query.limit;
    limit = parseInt(limit);
    offset = parseInt(offset);
    order = (query.order == undefined) ? 'asc' : query.order;
    search = (query.search == undefined) ? '' : query.search;
    var countquery = function (callback) {
        model.find({
        }, function (err, results) {
            if (err) return callback(err);
            else {
                return callback(null, results.length);
            }
        });
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
                    position: {
                        $regex: search,
                        $options: 'i'
                    }
                },                    
                {
                    'organization.org_name': {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'user.displayname': {
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
        }).collation({
            locale: "en"
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
                    position: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'organization.org_name': {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'user.displayname': {
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


var ObjectID = require('mongodb').ObjectID;

Contact.statics.RetrieveByID = function (query, callback) {
    var objid = new ObjectID(query.id);
    var model = mongoose.model('contacts', Contact);
    model.find({ _id: objid }, function (err, results) {
        if (err) return callback(err);
        return callback(null, results);
    }).lean();
};

Contact.statics.RetrieveByOrg = function (query, callback) {
    var model = mongoose.model('contacts', Contact);
    if (query.query == '') {
        model.find({org_id: query.org_id}
            , function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
    } else {
        model.find(
            {
                $or: [
                    { name: { $regex: query.query, $options: 'i' } },
                    { position: { $regex: query.query, $options: 'i' } },
                ],
                org_id: query.org_id
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
    }
};
var async = require('async');
Contact.statics.RetrieveByOrganization = function (query, callback) {
    var model = mongoose.model('contacts', Contact);
    sort = (query.sort == undefined) ? 'name' : query.sort;
    offset = (query.offset == undefined) ? 0 : query.offset;
    limit = (query.limit == undefined) ? 10 : query.limit;
    limit = parseInt(limit);
    offset = parseInt(offset);
    order = (query.order == undefined) ? 'asc' : query.order;
    search = (query.search == undefined) ? '' : query.search;
    var countquery = function (callback) {
        model.find({
            'organization.org_id': query.org_id,
        }, function (err, results) {
            if (err) return callback(err);
            else {
                return callback(null, results.length);
            }
        });
    }
    var actualquery = function (callback) {
        model.find({
            'organization.org_id': query.org_id,
            $or: [{
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    position: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'user.displayname': {
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
        }).collation({
            locale: "en"
        });
    }
    var actualquery_count = function (callback) {
        model.find({
            'organization.org_id': query.org_id,
            $or: [{
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    position: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'user.displayname': {
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

Contact.statics.RetrieveByOrganizationContribution = function (query, callback) {
    var model = mongoose.model('contacts', Contact);
    sort = (query.sort == undefined) ? 'name' : query.sort;
    offset = (query.offset == undefined) ? 0 : query.offset;
    limit = (query.limit == undefined) ? 10 : query.limit;
    limit = parseInt(limit);
    offset = parseInt(offset);
    order = (query.order == undefined) ? 'asc' : query.order;
    search = (query.search == undefined) ? '' : query.search;
    var countquery = function (callback) {
        model.find({
            'organization.org_id': query.org_id,
            'user.user_id': query.user_id,
        }, function (err, results) {
            if (err) return callback(err);
            else {
                return callback(null, results.length);
            }
        });
    }
    var actualquery = function (callback) {
        model.find({
            'organization.org_id': query.org_id,
            'user.user_id': query.user_id,
            $or: [{
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    position: {
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
        }).collation({
            locale: "en"
        });
    }
    var actualquery_count = function (callback) {
        model.find({
            'organization.org_id': query.org_id,
            'user.user_id': query.user_id,
            $or: [{
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    position: {
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

Contact.statics.RetrieveByUser2 = function (query, callback) {
    var model = mongoose.model('contacts', Contact);
    if(query.query == '') {
        model.find({user_id: query.user_id}
         , function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
    } else {
        model.find(
            {
                $or: [
                    { name: { $regex: query.query, $options: 'i' } },
                    { position: { $regex: query.query, $options: 'i' } },
                ],
                user_id: query.user_id
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
        }    
};

Contact.statics.RetrieveByUser = function(query, callback) {
    var model = mongoose.model('contacts', Contact);
    sort = (query.sort == undefined) ? 'name' : query.sort;
    offset = (query.offset == undefined) ? 0 : query.offset;
    limit = (query.limit == undefined) ? 10 : query.limit;
    limit = parseInt(limit);
    offset = parseInt(offset);
    order = (query.order == undefined) ? 'asc' : query.order;
    search = (query.search == undefined) ? '' : query.search;

    var countquery = function(callback) {
        model.find({
            user_id: query.user_id
        }, function(err, results) {
            if(err) return callback(err);
            else return callback(null, results.length);
        })
    }


    var actualquery = function(callback) {
        model.find(
            {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { position: { $regex: search, $options: 'i' } },
                    {
                        'organization.org_name': {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ],
                user_id: query.user_id
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean().skip(offset).limit(limit).sort({
                [sort]: order
            }).collation({
                locale: "en"
            });
        }  

        var actualquery_count = function(callback) {
            model.find(
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { position: { $regex: search, $options: 'i' } },
                        {
                            'organization.org_name': {
                                $regex: search,
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

        async.parallel([countquery, actualquery, actualquery_count], function (err, results) {
            console.log('counter', results[1]);
            if (err) return callback(err);
            else return callback(null, {
                count: results[0],
                filtered: results[2].length,
                data: results[1]
            })
        });
}



Contact.statics.Modify = function (query, callback) {
    var objid = new ObjectID(query.id);
    var q = { 
        'name': query.name, 
        'position': query.position, 
        'org_id': query.org_id, 
        'contact': query.contact,
        'organization.org_id': query.org_id, 
        'organization.org_name': query.org_name
        
     };
    var model = mongoose.model('contacts', Contact);
    model.update({ _id: objid, user_id: query.user_id }, q, function (err, raw) {
        if (err) return callback(err);
        return callback(null);
    }).lean();
};

Contact.statics.UpdateFromOrg = function(org) {
    var model = mongoose.model('contacts', Contact);
    var query = {
        organization: {
            org_id: org.id,
            org_name: org.name            
        }
    }

    model.update({'organization.org_id' : org.id}, query, { multi:true} , function(err,raw) {
        if(err) console.log(err);
    });
}

Contact.statics.Remove = function (query, callback) {
    var objid = new ObjectID(query.id);
    var model = mongoose.model('contacts', Contact);
    model.remove({ _id: objid }, function (err) {
        if (err) return callback(err);
        return callback(null);
    }).lean();
};

Contact.statics.RemoveWithOrg = function (query, callback) {
    var model = mongoose.model('contacts', Contact);
    model.remove({ org_id: query.id, user_id: query.user_id  }, function (err) {
        if (err) return callback(err);
        return callback(null);
    }).lean();
};


return mongoose.model('contacts', Contact);

}

