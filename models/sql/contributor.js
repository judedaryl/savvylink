const config = require('../../config/config');
const db = require('../../config/db');


var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;



class ContributorModel {

    retrieve(org_id, callback) {

        var connection = new Connection(db.sql.config);
        var query = '';
        connection.on('connect', function (err) {
            if (err) return ({
                error: err.message
            });
            else {
                connection.execSql(sqlquery());
            }
        });

        function sqlquery() {
            var query = 'select con.UserID, UserName, UserGivenName ';
            query += 'from dbo.Contributor con inner join dbo.[User] u on con.UserID = u.UserID ';
            query += 'where OrganizationID = ' + org_id;
            query += ' order by UserName asc';
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    var result = [];
                    rows.forEach(row => {
                        var data = {};
                        row.forEach(val => {
                            switch (val.metadata.colName) {
                                case 'UserID':
                                    data['_id'] = val.value;
                                    break;
                                case 'UserName':
                                    data['username'] = val.value;
                                    break;
                                case 'UserGivenName':
                                    data['displayname'] = val.value;
                                    break;
                                default:
                                    data[val.metadata.colName] = val.value;
                                    break;
                            }
                        });
                        result.push(data);
                    });
                    callback(err, result);
                }
            });
            return request;
        }


    }

    create(param, callback) {
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
            var query = 'insert into dbo.[Contributor] (UserID, OrganizationID,'
            query += 'DateCreated, CreatedBy,DateModified, ModifiedBy)';
            query += 'VALUES (@UserID, @OrganizationID,'
            query += '@DateCreated, @CreatedBy,@DateModified, @ModifiedBy)';
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });

            request.addParameter('UserID', TYPES.Int, param.user_id);
            request.addParameter('OrganizationID', TYPES.Int, param.id);
            request.addParameter('DateCreated', TYPES.DateTime, new Date());
            request.addParameter('CreatedBy', TYPES.Int, param.user_id);
            request.addParameter('DateModified', TYPES.DateTime, new Date());
            request.addParameter('ModifiedBy', TYPES.Int, 0);
            connection.execSql(request);
        }
    }

    checkemail(param, callback) {
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
            query = 'SELECT * from [dbo].[User] where UserEmail = @email';
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });
            request.addParameter('email', TYPES.NVarChar, param.email);
            connection.execSql(request);
        }
    }

    delete(param, callback) {
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
            var query = 'delete from dbo.[Contributor] ';
            query += "where UserID = " + param.user_id + " ";
            query += "and OrganizationID = " + param.id +" ";
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });
            connection.execSql(request);
        }
    }
}
module.exports = new ContributorModel();