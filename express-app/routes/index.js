const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      router = express.Router();
var db = require("./db.js");

router.get('/', function (req, res, next) {
    res.render('index');
});

module.exports = router;
