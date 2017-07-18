const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      url = require('url'),
      utilityFunctions = require('./functions.js'),
      router = express.Router();

var db = require('./db.js');

router.get('/' , function(req, res, next) {
  if(req.session.loggedin)
    res.redirect('/updateEntry/home');
  else if(!req.query.message)
    res.render('updateEntry/index' , {
      message : ''
    });
  else res.render('updateEntry/index' , {
      message : `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR!</strong> ${req.query.message}</div>`
    });
});

router.post('/checkPassword', function (req, res, next) {
  /*
  bsil@bajajsteel1234
  */
    var correct_password = '233f1b4e574fe3f80554895db85f875d153e245e458c5707dfa9c479276a787e',//'b7b64a56e78190dc159e8cd5bb8fb5acb98f732075e2b98ec7b715e30062dcd7',
        crypto = require('crypto'),
        password = 'Mj6ftpJG6jqwMlH7g1cn',
        hash = crypto.createHmac('sha256', password).update(req.body.password).digest('hex');
    if (hash === correct_password) {
        req.session.loggedin = "yes";
        res.redirect('/updateEntry/home');
    }
    else
        res.redirect(`/updateEntry?message=Incorrect%20Password`);
});

router.get('/home' , function(req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else
    res.render('updateEntry/home');
});

router.get('/updateName' , function(req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else {
    if(!req.query.type)
      res.reditect('/updateEntry/home');
    else {
      res.render('updateEntry/update_name');
    }
  }
});





module.exports = router;
