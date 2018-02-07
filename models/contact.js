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

var Contact = new mongoose.Schema({
    name: { type: String, required: false },
    position: { type: String, required: true },
    contact: { type: String, required: false },
    org_id: { type: String, required: true },
    user_id: { type: String, required: true }
}, { collection: 'contacts', strict: false });

Contact.pre('save', function (next) {
    var org = this;
    next();
});

Contact.post('save', function (next) {
    console.log('contact saved');
});

Contact.statics.Create = function (c, callback) {

    var model = mongoose.model('contacts', Contact);
    var newContact = model({
        name: c.name,
        position: c.position,
        org_id: c.org_id,
        user_id: c.user_id,
        contact: c.contact,
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
                    { position: { $regex: query.query, $options: 'i' } },
                ]
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
    }
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
                    { position: { $regex: query.query, $options: 'i' } },
                ],
                org_id: query.org_id
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
    }
};

Contact.statics.RetrieveByUser = function (query, callback) {
    var model = mongoose.model('contacts', Contact);
    if(query.query == '') {
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
                    { position: { $regex: query.query, $options: 'i' } },
                ],
                user_id: query.user_id
            }, function (err, results) {
                if (err) return callback(err);
                return callback(null, results);
            }).lean();
        }
    
};

Contact.statics.Modify = function (query, callback) {
    var objid = new ObjectID(query.id);
    var q = { 'name': query.name, 'position': query.position, 'org_id': query.org_id };
    var model = mongoose.model('contacts', Contact);
    model.update({ _id: objid, user_id: query.user_id }, q, function (err, raw) {
        if (err) return callback(err);
        return callback(null);
    }).lean();
};

Contact.statics.Remove = function (query, callback) {
    var objid = new ObjectID(query.id);
    var model = mongoose.model('contacts', Contact);
    model.remove({ _id: objid }, function (err) {
        if (err) return callback(err);
        return callback(null);
    }).lean();
};

Contact.statics.RemoveWithOrg = function (org_id, callback) {
    var model = mongoose.model('contacts', Contact);
    model.remove({ org_id: org_id }, function (err) {
        if (err) return callback(err);
        return callback(null);
    }).lean();
};
module.exports = mongoose.model('contacts', Contact);