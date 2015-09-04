var mongoose = require('mongoose');
var Promise = require('promise');
var db = mongoose.connection;

module.exports = {
    connect: function (url) {
        return new Promise(function (resolve, reject) {
            db.on('error', function (err) {
                reject(err);
            });
            db.once('open', function () {
                resolve(db);
            });
            mongoose.connect(url);
        });
    }
};
