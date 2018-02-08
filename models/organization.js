const mongoose = require('mongoose');
const db = require('../config/db');

mongoose.connect(db.url, {
    auth: {
        user: db.user,
        password: db.pass,
    },
    reconnectTries: 60,
    reconnectInterval: 1000,
});
mongoose.connection.on('connected', function () {
    console.log('Connected to OrgDB');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('OrgDB connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('OrgDB connection disconnected');
});

var Organization = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: false },
    address_1: { type: String, required: false },
    address_2: { type: String, required: false },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    user_id: { type: String, required: true },
}, { collection: 'organizations', strict: false });

Organization.pre('save', function (next) {
    var org = this;
    next();
});

Organization.post('save', function (next) {
    console.log('organization saved');
});

Organization.statics.Create = function (org, callback) {

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


Organization.statics.Retrieve = function (query, callback) {
    var model = mongoose.model('organizations', Organization);
    console.log('ahm here');
    console.log(query);
    if (query.query == '') {
        model.find({}
            , function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
    } else {
        model.find(
            {
                $or: [
                    { name: { $regex: query.query, $options: 'i' } },
                    { city: { $regex: query.query, $options: 'i' } },
                    { province: { $regex: query.query, $options: 'i' } },
                    { country: { $regex: query.query, $options: 'i' } }
                ]
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
    }



};

var ObjectID = require('mongodb').ObjectID;

Organization.statics.RetrieveByID = function (query, callback) {
    var objid = new ObjectID(query.id);
    var model = mongoose.model('organizations', Organization);
    model.find({ _id: objid }, function (err, results) {
        if (err) return callback(err);
        return callback(null, results);
    }).lean();
};


Organization.statics.RetrieveByUserID = function (query, callback) {
    var model = mongoose.model('organizations', Organization);
    if (query.query == '') {
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
                    { city: { $regex: query.query, $options: 'i' } },
                    { province: { $regex: query.query, $options: 'i' } },
                    { country: { $regex: query.query, $options: 'i' } }
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
    model.remove({ _id: objid }, function (err) {
        if (err) return callback(err);
        return callback(null);
    }).lean();
};

Organization.statics.Checkname = function (query, callback) {
    var model = mongoose.model('organizations', Organization);
    model.find({ name: query.name }, function (err, results) {
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
        'city': query.city,
        'province': query.province,
        'country': query.country,
    };
    var model = mongoose.model('organizations', Organization);
    model.update({ _id: objid, user_id: query.user_id }, q, function (err, raw) {
        if (err) return callback(err);
        return callback(null);
    }).lean();
};


module.exports = mongoose.model('organizations', Organization);