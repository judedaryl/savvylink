const config = require('../../config/config');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const privatekey = config.jwt;
const SALT_FACTOR = 12;

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;



class UserModel {

    login(param, callback) {
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
            var query = "SELECT * from [dbo].[User] where UserEmail = @email";
            var request = new Request(query, function (err, rowcount, rows) {
                if (err) {
                    callback({
                        error: err.message
                    });
                } else if (rowcount == 0) {
                    callback({
                        data: "Account not registered",
                        status: "bad"
                    });
                }

            });


            request.on('row', function (columns) {
                var result = {};
                columns.forEach(col => {
                    const key = col.metadata.colName;
                    const val = col.value;
                    result[key] = val;
                });

                compare(param.password, result.Password).then(isMatch => {
                    switch (isMatch.match) {
                        case true:
                            var userdata = {
                                username: result.UserName,
                                name: result.UserGivenName,
                                email: result.UserEmail,
                                _id: result.UserID,
                                photo: result.UserPhoto,
                            }
                            var token = jsonwebtoken.sign(userdata, privatekey, {
                                expiresIn: config.jwtexpire
                            });
                            callback(null, {
                                status: "ok",
                                data: token
                            });
                            break;
                        case false:
                            callback({
                                status: 'bad',
                                data: 'Invalid credentials'
                            })
                            break;
                    };
                });
            });

            request.addParameter('email', TYPES.NVarChar, param.email);
            connection.execSql(request);
        }

        function compare(compare, password) {
            return new Promise((resolve, reject) => {
                bcrypt.compare(compare, password, function (err, isMatch) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            match: isMatch
                        });
                    }
                });
            });
        }
    }
    register(param, callback) {
        var connection = new Connection(db.sql.config);
        var query = '';
        connection.on('connect', function (err) {
            if (err) return ({
                error: err.message
            });
            else {
                hashpassword(param.password).then(result => {
                    sqlquery(result.password);
                });
            }
        });

        function hashpassword(password) {
            return new Promise((resolve, reject) => {
                bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({
                                password: hash
                            });
                        }
                    });
                });
            });
        }

        function sqlquery(password) {
            var query = "INSERT INTO [dbo].[User] (UserName, UserGivenName, UserFirstName, UserLastName, UserEmail, UserPhoto, Password, DateCreated, DateModified, CreatedBy, ModifiedBy)";
            query += "VALUES (@UserName, @UserGivenName, @UserFirstName, @UserLastName, @UserEmail, @UserPhoto, @Password, @DateCreated , @DateModified, @CreatedBy, @ModifiedBy);";

            // Read all rows from table
            var request = new Request(query, function (err, rowcount, rows) {
                if (err) {
                    var error = '';
                    if (err.message.search('UniqueUserName') != -1) {
                        error = 'Username already exists';
                    } else if (err.message.search('UniqueEmail') != -1) {
                        error = 'Email already exists';
                    } else {
                        error = err.message;
                    }
                    callback(error);
                } else {
                    callback(null, {
                        success: true
                    });
                }
            });


            request.addParameter('UserName', TYPES.NVarChar, param.username);
            request.addParameter('UserGivenName', TYPES.NVarChar, param.firstname + ' ' + param.lastname);
            request.addParameter('UserFirstName', TYPES.NVarChar, param.firstname);
            request.addParameter('UserLastName', TYPES.NVarChar, param.lastname);
            request.addParameter('UserEmail', TYPES.NVarChar, param.email);
            request.addParameter('UserPhoto', TYPES.NVarChar, config.registrationImage);
            request.addParameter('Password', TYPES.NVarChar, password);
            request.addParameter('DateCreated', TYPES.DateTime, new Date());
            request.addParameter('DateModified', TYPES.DateTime, new Date());
            request.addParameter('CreatedBy', TYPES.Int, 0);
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

    checkusername(param, callback) {
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
            query = 'SELECT * from [dbo].[User] where UserName = @uname';
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });
            request.addParameter('uname', TYPES.NVarChar, param.uname);
            connection.execSql(request);
        }
    }

    finduser(param, callback) {
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
            query = "SELECT UserID as _id,UserName as username,UserGivenName as [name],UserEmail as email ";
            query += "from [dbo].[User] where UserGivenName like '%" + param.query + "%' or UserEmail like '%" + param.query + "%'";
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    var returnval = {
                        total: 0,
                        result: [],
                    }

                    rows.forEach(elem => {
                        var data = {
                            _id: 0,
                            username: {},
                            name: [],
                            email: '',
                        };
                        var contributor = {
                            _id: 0,
                            username: '',
                            displayname: '',
                        }
                        elem.forEach(val => {
                            data[val.metadata.colName] = val.value;

                        });
                        returnval.result.push(data);
                    });
                    callback(null, returnval);
                }
            });
            request.addParameter('uname', TYPES.NVarChar, param.uname);
            connection.execSql(request);
        }
    }

    username(param, callback) {
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
            query = "SELECT UserID as _id,UserName as username,UserGivenName as [name],UserEmail as email ";
            query += "from [dbo].[User] where UserName = '" + param.username + "'";
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    var returnval = {
                        total: 0,
                        result: [],
                    }

                    rows.forEach(elem => {
                        var data = {
                            _id: 0,
                            username: {},
                            name: [],
                            email: '',
                        };
                        var contributor = {
                            _id: 0,
                            username: '',
                            displayname: '',
                        }
                        elem.forEach(val => {
                            data[val.metadata.colName] = val.value;

                        });
                        returnval.result.push(data);
                    });
                    callback(null, returnval);
                }
            });
            request.addParameter('uname', TYPES.NVarChar, param.uname);
            connection.execSql(request);
        }
    }
}
module.exports = new UserModel();