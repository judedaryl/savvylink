module.exports = function (mongoose) {

    
var Hit = new mongoose.Schema({
    user_id: { type: String, required: false },
    ip_address: {type: String, required: false },
    date_created: {type: String, default: Date.now}
}, { collection: 'hits', strict: false });

Hit.pre('save', function (next) {
    var org = this;
    next();
});

Hit.post('save', function (next) {
    console.log('hit saved');
});

Hit.statics.Create = function (query, callback) {
    console.log(query);
    var model = mongoose.model('hits', Hit);
    var newHit = model({
    user_id: query.userinfo.id,
    ip_address: query.ip
    });

    newHit.save(function (err) {
        model.find({}, function(err,doc){
            if (err) return callback(err);
            return callback(null, {count: doc.length});
        }).lean();
    });
}

return mongoose.model('hits', Hit);

}

