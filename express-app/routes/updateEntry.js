const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      url = require('url'),
      utilityUpdateFunctions = require('./updateFunctions.js'),
      router = express.Router(),
      db = require('./db.js');

router.get('/', function(req, res, next) {
  if(req.session.loggedin)
    res.redirect('/updateEntry/home');
  else if(!req.query.message)
    res.render('updateEntry/index', {
      message : ''
    });
  else res.render('updateEntry/index', {
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
    } else
        res.redirect(`/updateEntry?message=Incorrect%20Password`);
});

router.get('/home', function(req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else
    res.render('updateEntry/home');
});


/* *************************************** */
/* UPDATE NAMES OF MACHINES/WORKROLLS */

router.get('/updateName', function(req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else {
    if(!req.query.type)
      res.redirect('/updateEntry/home');
    else if(!req.query.name || !req.query.message){
      res.render('updateEntry/update_name', {
          heading : (req.query.type === "roll")?"Work Roll" : "Machine",
          purpose: `Update Name Of ${(req.query.type === "roll")?"Work Roll" : "Machine"}`,
          purposeKeyword: `update`,
          type : req.query.type,
          name : '',
          error : '',
          message: ''
      });
    } else {
      res.render('updateEntry/update_name', {
          heading : (req.query.type === "roll")?"Work Roll" : "Machine",
          type : req.query.type,
          purpose: `Update Name Of ${(req.query.type === "roll")?"Work Roll" : "Machine"}`,
          purposeKeyword: `update`,
          name : req.query.name,
          error : `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>${req.query.message}</div>`,
          message: ''
      });
    }
  }
});

router.post('/updateName', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.body.name || !req.body.type)
        res.redirect('/updateEntry/home');
      else
        utilityUpdateFunctions.commonUpdateDeleteChecking(req, res, "update");
  }
});

router.get('/updateIndividualName', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.name || !req.query.type)
        res.redirect('/updateEntry/home');
      else {
        res.render('updateEntry/update_individual_name', {
              heading : (req.query.type === "roll")?"Work Roll" : "Machine",
              type : req.query.type,
              name : req.query.name,
              error : "",
            });
        }
    }
});

router.post('/updateIndividualName', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.body.newname || !req.body.type ||!req.body.oldname)
        res.redirect('/updateEntry/home');
      else {
          var doc_response = {
                heading : (req.body.type === "roll")?"Work Roll" : "Machine",
                type : req.body.type,
                name : req.body.newname,
                error : "",
              };
        if(req.body.type === "m_no") {
          db.machine.update({ m_no: req.body.oldname },
                    { $set: { m_no: req.body.newname } }, { multi: false, upsert: false }, function (err, numAffected, affectedDocuments, upsert) {

                if(err || numAffected==0) {
                    doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${(err)?(err.message):('The Machine Does Not Exist')}</div>`;
                    res.render('updateEntry/update_individual_name', doc_response);
                } else {
                  res.redirect(`/updateEntry/updateName?type=${req.body.type}&name=${req.body.newname}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
                }
          });
        } else if(req.body.type === "roll") {
          db.workroll.update({ roll: req.body.oldname },
                    { $set: { roll: req.body.newname } }, { multi: false, upsert: false }, function (err, numAffected, affectedDocuments, upsert) {

                if(err || numAffected==0) {
                  doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${(err)?(err.message):('The Work Roll Does Not Exist')}</div>`;
                    res.render('updateEntry/update_individual_name', doc_response);
                } else {
                  res.redirect(`/updateEntry/updateName?type=${req.body.type}&name=${req.body.newname}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
                }
          });
          } else
             res.redirect('/updateEntry/home');
        }
    }
});

/* *************************************** */
/* DELETE NAMES OF MACHINES/WORKROLLS */

router.get('/deleteName', function(req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else {
    if(!req.query.type)
      res.redirect('/updateEntry/home');
    else if(!req.query.name || !req.query.message){
      res.render('updateEntry/update_name', {
          heading : (req.query.type === "roll")?"Work Roll" : "Machine",
          type : req.query.type,
          purpose: `Delete ${(req.query.type === "roll")?"Work Roll" : "Machine"}`,
          purposeKeyword: `delete`,
          name : '',
          error : '',
          message: ''
      });
    } else {
      res.render('updateEntry/update_name', {
          heading : (req.query.type === "roll")?"Work Roll" : "Machine",
          type : req.query.type,
          name : req.query.name,
          purpose: `Delete ${(req.query.type === "roll")?"Work Roll" : "Machine"}`,
          purposeKeyword: `delete`,
          error : `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>${req.query.message}</div>`,
          message: ''
      });
    }
  }
});

router.post('/deleteName', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.body.name || !req.body.type)
        res.redirect('/updateEntry/home');
      else
        utilityUpdateFunctions.commonUpdateDeleteChecking(req, res, "delete");
      }
});

router.get('/deleteIndividualName', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.name || !req.query.type)
        res.redirect('/updateEntry/home');
      else {
        if(req.query.type === "m_no") {
            db.machine.remove ({
                m_no: req.query.name
            }, { multi:false} , function(err, numRemoved) {
                  if(err || numRemoved == 0)
                      res.redirect(`/updateEntry/deleteName?type=${req.query.type}&name=${req.query.name}&message=ERROR!%20%3C/strong%3E${((err)?err.message:"Machine%20Not%20Found")}`);
                  else
                    res.redirect(`/updateEntry/deleteName?type=${req.query.type}&name=${req.query.name}&message=SUCCESS!%20%3C/strong%3EDeleted Successfully`);
              });
          } else if(req.query.type === "roll") {
                db.workroll.remove ({
                    roll: req.query.name
                }, { multi:false} , function(err, numRemoved) {
                  if(err || numRemoved == 0)
                          res.redirect(`/updateEntry/deleteName?type=${req.query.type}&name=${req.query.name}&message=ERROR!%20%3C/strong%3E${((err)?err.message:"Work%20Roll%20Not%20Found")}`);
                      else
                        res.redirect(`/updateEntry/deleteName?type=${req.query.type}&name=${req.query.name}&message=SUCCESS!%20%3C/strong%3EDeleted Successfully`);
                  });
              }else
                res.redirect('/updateEntry/home');
        }
      }
});


/* *************************************** */
/* UPDATE ENTRY OF MACHINES/WORKROLLS */

router.get('/updateExistingEntry', function(req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else {
    if(!req.query.type)
      res.redirect('/updateEntry/home');
    else if(!req.query.name || !req.query.message){
      res.render('updateEntry/update_name', {
          heading : (req.query.type === "roll")?"Work Roll" : "Machine",
          purpose: `Update Existing Entry Of ${(req.query.type === "roll")?"Work Roll" : "Machine"}`,
          purposeKeyword: `updateexisting`,
          type : req.query.type,
          name : '',
          error : '',
          message: ''
      });
    } else {
      res.render('updateEntry/update_name', {
          heading : (req.query.type === "roll")?"Work Roll" : "Machine",
          type : req.query.type,
          purpose: `Update Existing Entry Of ${(req.query.type === "roll")?"Work Roll" : "Machine"}`,
          purposeKeyword: `updateexisting`,
          name : req.query.name,
          error : `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>${req.query.message}</div>`,
          message: ''
      });
    }
  }
});

router.post('/updateExistingEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.body.name || !req.body.type)
        res.redirect('/updateEntry/home');
      else
        utilityUpdateFunctions.commonUpdateDeleteChecking(req, res, "updateexisting");
  }
});

router.get('/updateBackUpRollEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.index || !req.query.type || !req.query.name || !req.query.type || !req.query.date || !req.query.dia || !req.query.comment)
        res.redirect('/updateEntry/home');
      else {
        res.render('updateEntry/update_backup_entry', {
              heading : (req.query.type === "roll")?"Work Roll" : "Machine",
              type : req.query.type,
              name : req.query.name,
              error : "",
            });
        }
    }
});

router.post('/updateBackUpRollEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.body.newname || !req.body.type ||!req.body.oldname)
        res.redirect('/updateEntry/home');
      else {
          var doc_response = {
                heading : (req.body.type === "roll")?"Work Roll" : "Machine",
                type : req.body.type,
                name : req.body.newname,
                error : "",
              };
        if(req.body.type === "m_no") {
          db.machine.update({ m_no: req.body.oldname },
                    { $set: { m_no: req.body.newname } }, { multi: false, upsert: false }, function (err, numAffected, affectedDocuments, upsert) {

                if(err || numAffected==0) {
                    doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${(err)?(err.message):('The Machine Does Not Exist')}</div>`;
                    res.render('updateEntry/update_individual_name', doc_response);
                } else {
                  res.redirect(`/updateEntry/updateName?type=${req.body.type}&name=${req.body.newname}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
                }
          });
        } else if(req.body.type === "roll") {
          db.workroll.update({ roll: req.body.oldname },
                    { $set: { roll: req.body.newname } }, { multi: false, upsert: false }, function (err, numAffected, affectedDocuments, upsert) {

                if(err || numAffected==0) {
                  doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${(err)?(err.message):('The Work Roll Does Not Exist')}</div>`;
                    res.render('updateEntry/update_individual_name', doc_response);
                } else {
                  res.redirect(`/updateEntry/updateName?type=${req.body.type}&name=${req.body.newname}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
                }
          });
          } else
             res.redirect('/updateEntry/home');
        }
    }
});

/* *************************************** */
/* DELETE ENTRY OF MACHINES/WORKROLLS */

router.get('/deleteExistingEntry', function(req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else {
    if(!req.query.type)
      res.redirect('/updateEntry/home');
    else if(!req.query.name || !req.query.message){
      res.render('updateEntry/update_name', {
          heading : (req.query.type === "roll")?"Work Roll" : "Machine",
          purpose: `Delete Existing Entry Of ${(req.query.type === "roll")?"Work Roll" : "Machine"}`,
          purposeKeyword: `deleteexisting`,
          type : req.query.type,
          name : '',
          error : '',
          message: ''
      });
    } else {
      res.render('updateEntry/update_name', {
          heading : (req.query.type === "roll")?"Work Roll" : "Machine",
          type : req.query.type,
          purpose: `Delete Existing Entry Of ${(req.query.type === "roll")?"Work Roll" : "Machine"}`,
          purposeKeyword: `deleteexisting`,
          name : req.query.name,
          error : `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>${req.query.message}</div>`,
          message: ''
      });
    }
  }
});

router.post('/deleteExistingEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.body.name || !req.body.type)
        res.redirect('/updateEntry/home');
      else
        utilityUpdateFunctions.commonUpdateDeleteChecking(req, res, "deleteexisting");
  }
});

/*  specific deletion middlewares */
router.get('/deleteBearingEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.index || !req.query.type || !req.query.name || !req.query.type || !req.query.date || !req.query.make || !req.query.comment)
        res.redirect('/updateEntry/home');
      else {
            db.machine.update({ m_no: req.query.name }, { $pull: { bearing: {
                date : new Date(req.query.date),
                make : req.query.make,
                comment : req.query.comment,
                type : req.query.type
            } } }, {multi : false , upsert : false}, function(err, numRemoved) {
                  if(err || numRemoved == 0)
                      res.redirect(`/updateEntry/deleteExistingEntry?type=m_no&name=${req.query.name}&message=ERROR!%20%3C/strong%3E${((err)?err.message:"Entry%20Not%20Found")}`);
                  else
                      res.redirect(`/updateEntry/deleteExistingEntry?type=m_no&name=${req.query.name}&message=SUCCESS!%20%3C/strong%3EDeleted%20Bearing%20Entry%20Successfully`);
              });
        }
      }
});

router.get('/deleteBackUpRollEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.index || !req.query.type || !req.query.name || !req.query.type || !req.query.date || !req.query.dia || !req.query.comment)
        res.redirect('/updateEntry/home');
      else {
            db.machine.update({ m_no: req.query.name }, { $pull: { roll: {
                date : new Date(req.query.date),
                dia : req.query.dia,
                comment : req.query.comment,
                type : req.query.type
            } } }, {multi : false , upsert : false}, function(err, numRemoved) {
                  if(err || numRemoved == 0)
                      res.redirect(`/updateEntry/deleteExistingEntry?type=m_no&name=${req.query.name}&message=ERROR!%20%3C/strong%3E${((err)?err.message:"Entry%20Not%20Found")}`);
                  else
                      res.redirect(`/updateEntry/deleteExistingEntry?type=m_no&name=${req.query.name}&message=SUCCESS!%20%3C/strong%3EDeleted%20Back%20Roll%20Entry%20Successfully`);
              });
        }
      }
});

router.get('/deleteWorkRollEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.index || !req.query.rollname || !req.query.m_no || !req.query.m_up || !req.query.m_down || !req.query.reason || !req.query.g_time || !req.query.dia || !req.query.operator || !req.query.comment)
        res.redirect('/updateEntry/home');
      else {
            db.workroll.update({ roll: req.query.rollname }, { $pull: { field: {
                m_no : req.query.m_no,
                m_up : new Date(req.query.m_up),
                m_down : new Date(req.query.m_down),
                reason : req.query.reason,
                g_time : new Date(req.query.g_time),
                dia : req.query.dia,
                operator : req.query.operator,
                comment : req.query.comment
            } } }, {multi : false , upsert : false}, function(err, numRemoved) {
                  if(err || numRemoved == 0)
                      res.redirect(`/updateEntry/deleteExistingEntry?type=roll&name=${req.query.rollname}&message=ERROR!%20%3C/strong%3E${((err)?err.message:"Entry%20Not%20Found")}`);
                  else
                      res.redirect(`/updateEntry/deleteExistingEntry?type=roll&name=${req.query.rollname}&message=SUCCESS!%20%3C/strong%3EDeleted%20Work%20Roll%20Entry%20Successfully`);
              });
        }
      }
});

module.exports = router;
