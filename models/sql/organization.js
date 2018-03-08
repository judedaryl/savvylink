const config = require('../../config/config');
const db = require('../../config/db');


var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var ContributorModel = require('../../models/sql/contributor');



class OrganizationModel {

    retrieve(param, type, callback) {
        var sort = (param.sort == undefined) ? 'OrganizationName' : param.sort;
        var offset = (param.offset == undefined) ? 0 : param.offset;
        var limit = (param.limit == undefined) ? 10 : param.limit;
        limit = parseInt(limit);
        limit = limit - 1;
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
            var query = 'select org.OrganizationID as _id, org.OrganizationName as name, org.OrganizationType as type, org.OrganizationAddress_1 as address_1, org.OrganizationAddress_2 as address_2, org.OrganizationCity as city, org.OrganizationProvince as province, org.OrganizationCountry as country,cru.UserID, cru.UserName, cru.UserGivenName, contri.UserID as ContributorID,contri.UserName as ContributorUserName, contri.UserGivenName as ContributorGivenName, org.Total as Total ';
            query += ' from (select *, count(*) over() AS Total FROM dbo.Organization) org ';
            query += ' left join dbo.[User] cru ON org.UserID = cru.UserID ';
            query += ' left join dbo.Contributor con on org.OrganizationID=con.OrganizationID ';
            query += ' left join dbo.[User] contri ON con.UserID = contri.UserID ';


            query += " where (OrganizationName like '%" + search + "%' or OrganizationType like '%" + search + "%' or  OrganizationAddress_1 like '%" + search + "%' or OrganizationAddress_2 like '%" + search + "%'  or  OrganizationCity like '%" + search + "%' or  OrganizationProvince like '%" + search + "%'  or OrganizationCountry like '%" + search + "%' or cru.UserGivenName like '%" + search + "%') ";

            if (param.user_id != undefined && param.user_id != '') {
                switch (type) {
                    case 'contribution':
                        query += "and contri.UserID = " + param.user_id;
                        break;
                    case 'user':
                        query += "and cru.UserID = " + param.user_id;
                        break;
                }
            }
            if (param.id != undefined && param.id != '') {

                switch (type) {
                    case 'org_id':
                        query += "and org.OrganizationID = " + param.id;
                        break;
                }
            }
            if (param.name != undefined && param.name != '') {
                switch (type) {
                    case 'checkname':
                        query += "and org.OrganizationName = '" + param.name + "'";
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

                    rows.forEach(elem => {
                        var data = {
                            _id: 0,
                            user: {},
                            contributors: [],
                            name: '',
                            type: '',
                            address_1: '',
                            address_2: '',
                            city: '',
                            province: '',
                            country: '',
                            user_id: ''
                        };
                        var contributor = {
                            _id: 0,
                            username: '',
                            displayname: '',
                        }
                        elem.forEach(val => {
                            switch (val.metadata.colName) {
                                case 'UserID':
                                    data['user_id'] = val.value;
                                    data['user']['user_id'] = val.value;
                                    break;
                                case 'UserGivenName':
                                    data['user']['displayname'] = val.value;
                                    break
                                case 'UserName':
                                    data['user']['username'] = val.value;
                                    break;
                                case 'Total':
                                    returnval.total = val.value;
                                    break;
                                case 'ContributorID':
                                    contributor._id = val.value;
                                    break;
                                case 'ContributorUserName':
                                    contributor.username = val.value;
                                    break;
                                case 'ContributorGivenName':
                                    contributor.displayname = val.value;
                                    if (contributor.displayname != null) {
                                        data.contributors.push(contributor);
                                    }
                                    break;
                                default:
                                    data[val.metadata.colName] = val.value;
                                    break;
                            }
                        });
                        if (returnval.result.some(val => val._id == data._id)) {
                            var existId = returnval.result.findIndex(val => val._id == data._id);
                            returnval.result[existId].contributors.push(contributor);
                        } else {
                            returnval.result.push(data);
                        }
                    });
                    
                    switch (type) {
                        case 'org_id':
                        
                            break;
                        default:
                            
                            break;
                    }
                    callback(null, returnval);
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
            var query = 'insert into dbo.[Organization] (OrganizationName, OrganizationType,'
            query += 'OrganizationAddress_1, OrganizationAddress_2, OrganizationCity,';
            query += 'OrganizationProvince, OrganizationCountry, DateCreated, CreatedBy,';
            query += 'DateModified, ModifiedBy, UserID)';
            query += 'VALUES (@OrganizationName, @OrganizationType,'
            query += '@OrganizationAddress_1, @OrganizationAddress_2, @OrganizationCity,';
            query += '@OrganizationProvince, @OrganizationCountry, @DateCreated, @CreatedBy,';
            query += '@DateModified, @ModifiedBy, @UserID); select @@identity';
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });

            request.on('row', function (columns) {
                ContributorModel.create({
                    user_id: param.user_id,
                    id: columns[0].value
                }, (err, resp) => {
                    console.log(err, resp);
                });
            });

            request.addParameter('OrganizationName', TYPES.NVarChar, param.name);
            request.addParameter('OrganizationType', TYPES.NVarChar, param.type);
            request.addParameter('OrganizationAddress_1', TYPES.NVarChar, param.address_1);
            request.addParameter('OrganizationAddress_2', TYPES.NVarChar, param.address_2);
            request.addParameter('OrganizationCity', TYPES.NVarChar, param.city);
            request.addParameter('OrganizationProvince', TYPES.NVarChar, param.province);
            request.addParameter('OrganizationCountry', TYPES.NVarChar, param.country);
            request.addParameter('UserID', TYPES.Int, param.user_id);
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
            var query = 'update dbo.[Organization] ';
            query += 'SET ';
            query += 'OrganizationName = @OrganizationName, OrganizationType = @OrganizationType, OrganizationAddress_1 = @OrganizationAddress_1, OrganizationAddress_2 = @OrganizationAddress_2, OrganizationCity = @OrganizationCity, OrganizationProvince = @OrganizationProvince,OrganizationCountry = @OrganizationCountry, DateModified = @DateModified, ModifiedBy = @ModifiedBy ';
            query += 'WHERE OrganizationID = @OrganizationID and UserID = @UserID';
            var request = new Request(query, (err, rowCount, rows) => {
                if (err) callback(err)
                else {
                    callback(null, rowCount);
                }
            });
            request.addParameter('OrganizationName', TYPES.NVarChar, param.name);
            request.addParameter('OrganizationType', TYPES.NVarChar, param.type);
            request.addParameter('OrganizationAddress_1', TYPES.NVarChar, param.address_1);
            request.addParameter('OrganizationAddress_2', TYPES.NVarChar, param.address_2);
            request.addParameter('OrganizationCity', TYPES.NVarChar, param.city);
            request.addParameter('OrganizationProvince', TYPES.NVarChar, param.province);
            request.addParameter('OrganizationCountry', TYPES.NVarChar, param.country);
            request.addParameter('OrganizationID', TYPES.Int, param.id);
            request.addParameter('UserID', TYPES.Int, param.user_id);
            request.addParameter('DateModified', TYPES.DateTime, new Date());
            request.addParameter('ModifiedBy', TYPES.Int, param.user_id);
            connection.execSql(request);
        }
    }
}
module.exports = new OrganizationModel();