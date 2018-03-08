const config = require('../../config/config');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const privatekey = config.jwt;
const SALT_FACTOR = 12;

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

class HitModel {

    hit(data, callback) {
        var connection = new Connection(db.sql.config);
        var query = '';
        connection.on('connect', function (err) {
            if (err) return ({
                error: err.message
            });
            else {
                sqlquery();
            }
        });

        function sqlquery() {
            var query = "insert into dbo.[Hit] (HitIPAddress, DateCreated, CreatedBy, DateModified, ModifiedBy)";
            query += "values (@HitIPAddress, @DateCreated, @CreatedBy, @DateModified, @ModifiedBy)";

            var request = new Request(query, (err, rowCount, rows) => {
                if (err) {
                    var error = err.message;
                    callback(error);
                } else {
                    callback(null, rowCount);
                }
            });

            request.addParameter('HitIPAddress', TYPES.NVarChar, data.ip);
            request.addParameter('DateCreated', TYPES.DateTime, new Date());
            request.addParameter('CreatedBy', TYPES.Int, data.userid);
            request.addParameter('DateModified', TYPES.DateTime, new Date());
            request.addParameter('ModifiedBy', TYPES.Int, data.userid);
            connection.execSql(request);
        }
    }

    counthits(param, callback) {
        
        var connection = new Connection(db.sql.config);
        var query = '';
        connection.on('connect', function (err) {
            if (err) return ({
                error: err.message
            });
            else {
                sqlquery();
            }
        });

        function sqlquery() {
            var query = "select count(*) from dbo.[Hit]";
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) {
                    var error = err.message;
                    callback(error);
                }
            });

            request.on('row', (column) => {
                callback(null, column[0].value);
            })
            connection.execSql(request);
        }
    }
}

module.exports = new HitModel();