var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var passport = require('passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// MongoDB Collections and Schema

const mongoose = require('mongoose');
const db = require('./config/db');


// mongoose.connect(db.url, {
//   /**
//    *     
//       auth: {
//           user: db.user,
//           password: db.pass,
//       },
      
//    */

//   reconnectTries: 60,
//   reconnectInterval: 1000,
// });
// mongoose.connection.on('connected', function () {
//   console.log('Connected to MongoDB');
// });

// // If the connection throws an error
// mongoose.connection.on('error', function (err) {
//   console.log('OrgDB connection error: ' + err);
// });

// // When the connection is disconnected
// mongoose.connection.on('disconnected', function () {
//   console.log('OrgDB connection disconnected');
// });

// var contactmodel = require('./models/contact')(mongoose);
// var organizationmodel = require('./models/organization')(mongoose);
// var usermodel = require('./models/user')(mongoose);
// var statmodel = require('./models/hit')(mongoose);

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});



app.use('/users', users);




var expressJwt = require('express-jwt');
var config = require('./config/config');
var privatekey = config.jwt;

app.use('/api', expressJwt({
  secret: privatekey
}));

// var userapi = require('./routes/userapi')(organizationmodel, contactmodel, usermodel);
var userapisql = require('./routes/sql/userapi')();
app.use('/api/userapi', userapisql);
// app.use('/api/userapi3', userapi);
// var neworganization = require('./routes/organizationNew')(organizationmodel, contactmodel, usermodel);
// var getorganization = require('./routes/organizationGet')(organizationmodel, contactmodel, usermodel);
// var delorganization = require('./routes/organizationDel')(organizationmodel, contactmodel, usermodel);
// var putorganization = require('./routes/organizationPut')(organizationmodel, contactmodel, usermodel);

/**
 *  ORGANIZATION API
 * 
 * 
app.use('/api/organization/create', neworganization);
app.use('/api/organization/modify', putorganization);
app.use('/api/organization/remove', delorganization);
 */
// app.use('/api/organization2/get', getorganization);

/** 
 *  ORGANIZATION API SQL
 */
var organizationsql = require('./routes/sql/organization')();
app.use('/api/organization', organizationsql);
var compute = require('./routes/compute')();
app.use('/compute', compute);
// var contactroute = require('./routes/contact')(organizationmodel, contactmodel, usermodel);
var contactroutesql = require('./routes/sql/contact')();
// app.use('/api/contact', contactroute);
app.use('/api/contact', contactroutesql);
// var userroute = require('./routes/user')(organizationmodel, contactmodel, usermodel);
var usersqlroute = require('./routes/sql/user')();
app.use('/user', usersqlroute);

// var statistics = require('./routes/hit')(statmodel);
var statisticssql = require('./routes/sql/hit')();
app.use('/hit', statisticssql);


var authentication = require('./auth/authentication');
app.use('/api/auth', authentication);

// var authlinkedin = require('./auth/linkedin')(app, passport);

app.use(express.static(path.join(__dirname, 'public/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dist/index.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dist/index.html'));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token')
    return;
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;