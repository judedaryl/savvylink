const config = require('../../config/config');
const db = require('../../config/db');


var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;



class ContactModel {

    retrieve(param, type, callback) {
        var sort = (param.sort == undefined) ? 'ContactName' : param.sort;
        var offset = (param.offset == undefined) ? 0 : param.offset;
        var limit = (param.limit == undefined) ? 10 : param.limit;
        limit = parseInt(limit);
        // limit = limit - 1;
        offset = parseInt(offset);
        var order = (param.order == undefined) ? 'asc' : param.order;
        var search = (param.search == undefined) ? '' : param.search;

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
            var query = 'select con.ContactID as _id,con.ContactName as [name],con.ContactPosition as position,org.OrganizationID,org.OrganizationName,u.UserID,u.UserName,u.UserGivenName, count(*) over() as Total ';
            query += 'from dbo.Contact con left join dbo.Organization org on org.OrganizationID = con.OrganizationID left join dbo.[User] u on con.UserID = u.UserID ';

            query += " where (org.OrganizationName like '%" + search + "%' or con.ContactName like '%" + search + "%' or  con.ContactPosition like '%" + search + "%' or u.UserGivenName like '%" + search + "%') ";

            if (param.id != undefined && param.id != '') {

                switch (type) {
                    case 'con_id':
                        query += "and con.ContactID = " + param.id + " ";
                        break;
                }
            }

            if (param.org_id != undefined && param.org_id != '') {

                switch (type) {
                    case 'org_id':
                        query += "and con.OrganizationID = " + param.org_id + " ";
                        break;
                    case 'contribution':
                        query += "and con.OrganizationID = " + param.org_id + " ";
                        break;
                }
            }

            if (param.user_id != undefined && param.user_id != '') {

                switch (type) {
                    case 'user_id':
                        query += "and con.UserID = " + param.user_id + " ";
                        break;
                    case 'contribution':
                        query += "and con.UserID = " + param.user_id + " ";
                        break;
                }
            }

            query += ' order by ' + sort + ' ' + order + ' offset @offset rows fetch next ' + limit + ' rows only';

            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    var returnval = {
                        total: 0,
                        result: [],
                    }
                    rows.forEach(row => {
                        var data = {
                            _id: 0,
                            user: {
                                user_id: 0,
                                username: '',
                                displayname: ''
                            },
                            organization: {
                                org_id: 0,
                                org_name: '',
                            },
                            name: '',
                            postition: '',
                            org_id: 0,
                            user_id: 0,
                        };

                        row.forEach(val => {
                            switch (val.metadata.colName) {
                                case 'UserID':
                                    data['user_id'] = val.value;
                                    data['user']['user_id'] = val.value;
                                    break;
                                case 'UserName':
                                    data['user']['username'] = val.value;
                                    break;
                                case 'UserGivenName':
                                    data['user']['displayname'] = val.value;
                                    break;
                                case 'OrganizationID':
                                    data['org_id'] = val.value;
                                    data['organization']['org_id'] = val.value;
                                    break;
                                case 'OrganizationName':
                                    data['organization']['org_name'] = val.value;
                                    break;
                                case 'Total':
                                    returnval.total = val.value;
                                    break;
                                default:
                                    data[val.metadata.colName] = val.value;
                                    break;
                            }
                        });
                        returnval.result.push(data);
                    });
                    callback(err, returnval);
                }
            });
            request.addParameter('sort', TYPES.NVarChar, sort);
            request.addParameter('offset', TYPES.Int, offset);
            request.addParameter('limit', TYPES.Int, limit);
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
            var query = 'insert into dbo.[Contact] (ContactName, ContactPosition, UserID, OrganizationID,'
            query += 'DateCreated, CreatedBy,DateModified, ModifiedBy)';
            query += 'VALUES (@ContactName, @ContactPosition, @UserID, @OrganizationID,'
            query += '@DateCreated, @CreatedBy,@DateModified, @ModifiedBy)';
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });

            request.addParameter('ContactName', TYPES.NVarChar, param.name);
            request.addParameter('ContactPosition', TYPES.NVarChar, param.position);
            request.addParameter('UserID', TYPES.Int, param.user_id);
            request.addParameter('OrganizationID', TYPES.Int, param.org_id);
            request.addParameter('DateCreated', TYPES.DateTime, new Date());
            request.addParameter('CreatedBy', TYPES.Int, param.user_id);
            request.addParameter('DateModified', TYPES.DateTime, new Date());
            request.addParameter('ModifiedBy', TYPES.Int, 0);
            connection.execSql(request);
        }
    }

    modify(param, callback) {
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
            var query = 'update dbo.[Contact] ';
            query += 'SET ';
            query += 'ContactName = @ContactName, ContactPosition = @ContactPosition, OrganizationID = @OrganizationID, DateModified = @DateModified, ModifiedBy = @ModifiedBy ';
            query += 'WHERE ContactID = @ContactID and UserID = @UserID';
            console.log(query);
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });

            request.addParameter('ContactName', TYPES.NVarChar, param.name);
            request.addParameter('ContactPosition', TYPES.NVarChar, param.position);
            request.addParameter('OrganizationID', TYPES.Int, param.org_id);
            request.addParameter('ContactID', TYPES.Int, param.id);
            request.addParameter('UserID', TYPES.Int, param.user_id);
            request.addParameter('DateModified', TYPES.DateTime, new Date());
            request.addParameter('ModifiedBy', TYPES.Int, param.user_id);
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

    del(param, callback) {
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
            var query = 'delete from dbo.[Contact] ';
            query += "where ContactID = " + param.id + " ";
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });
            connection.execSql(request);
        }
    }

    removewithorg(param, callback) {
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
            var query = 'delete from dbo.[Contact] ';
            query += "where UserID = " + param.user_id + " ";
            query += "and OrganizationID = " + param.org_id + " ";
            console.log(param);
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });
            connection.execSql(request);
        }
    }

    count(callback) {
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
            var query = 'select COUNT(*) as total from dbo.Contact';
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    var returnval = {
                        total: 0,
                        result: [],
                    }
                    rows[0].forEach(val => {
                        returnval.result = [{count: val.value}];
                        returnval.total = 1;
                    });
                    callback(null, returnval);
                }
            });
            return request;
        }
    }
}
module.exports = new ContactModel();