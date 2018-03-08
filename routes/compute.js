var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var privatekey = config.jwt;
var xml = require('xml');
var jsonxml = require('jsontoxml');

module.exports = function () {
  router.get('/', function (req, res, next) {
    var mode = req.query.mode;
    var n = req.query.n;
    var r = req.query.r;

    if ((mode == undefined || mode == null) && ( mode != "perm" || mode != "comb" )) {
      var err = '';
      err += 'please set mode using "?mode={value}"<br>\n';
      err += 'VALUES for mode<br>\n';
      err += 'perm = Permutation<br>\n';
      err += 'comb = Combination\n';
      res.send(err);
      return;
    }
    if (n == undefined || n == null) {
      var err = '';
      err += 'please set value for n using "?n={value}"<br>\n';
      res.send(err);
      return;
    }
    if (r == undefined || r == null) {
      var err = '';
      err += 'please set value for r using "?r={value}"<br>\n';
      res.send(err);
      return;
    }

    n = parseInt(n);
    r = parseInt(r);
    var p = n - r;
    var n_fac = 1;
    var r_fac = 1;
    var p_fac = 1;

    for (let i = 1; i <= n; i++) {
      n_fac = n_fac * i;
    }

    for (let i = 1; i <= r; i++) {
      r_fac = r_fac * i;
    }

    for (let i = 1; i <= p; i++) {
      p_fac = p_fac * i;
    }
    n_fac_ = n + "!";
    r_fac_ = r + "!";
    p_fac_ = "(" + n + " - " + r + ")!";

    switch (mode) {
      case 'perm':
        var out = n_fac / p_fac;
        var result = 'Permutation<br><br>';
        break;
      case 'comb':
        var out = n_fac / (p_fac * r_fac);
        var result = 'Combination<br><br>';
        break;
    }

    result += n_fac_ + " = " + n_fac + "<br><br>";
    result += r_fac_ + " = " + r_fac + "<br><br>";
    result += p_fac_ + " = " + p_fac + "<br><br>";
    result += "ANSWER = " + out + "<br><br>";
    res.send(result);
  });




  return router;
}