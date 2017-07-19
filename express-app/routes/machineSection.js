const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      url = require('url'),
      utilityFunctions = require('./functions.js'),
      router = express.Router(),
      db = require('./db.js');

router.get('/', function (req, res, next) {
    res.render('machineSection/index');
});

/* ************************************************************ */
/* Bearing Section Begins  */

//middlewares to add new machine
router.get('/addNewMachine', function (req, res, next) {
    res.render('machineSection/add_new_machine', {
        machine: '',
        message: '',
    });
});

router.post('/addNewMachine', function (req, res, next) {
    if(!req.body.m_no)
      res.redirect('/machineSection');
    else {
    db.machine.insert({
        m_no: req.body.m_no,
        bearing: [],
        roll: []
    }, function (err, newDoc) {
        if (err) {
          res.render('machineSection/add_new_machine', {
            'machine': req.body.m_no,
              'message': `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR!</strong> ${err.message}</div>`,
          });
        } else {
          res.render('machineSection/add_new_machine', {
            'machine': req.body.m_no,
            'message': `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>SUCCESS!</strong> Added Entry Sucessfully</div>`,
          });
        }
    });
  }
});

//middlewares to add  machine bearing entry
router.get('/addMachineBearingEntry', function (req, res, next) {
      if(!req.query.type)
        res.redirect('/machineSection');
      else
        res.render('machineSection/add_machine_entry', {
          type: req.query.type,
          machine: '',
          date: '',
          make: '',
          comment: '',
          message: '',
          heading: utilityFunctions.getMachineTypeName(req.query.type),
      });
});

router.post('/addMachineBearingEntry', function(req, res, next) {
  if(!req.body.date || !req.body.type || !req.body.m_no || !req.body.make)
    res.redirect('/machineSection');
  else {
    var date = new Date(req.body.date),
        doc_response = {
        type: req.body.type,
        machine: req.body.m_no,
        date: req.body.date,
        make: req.body.make,
        comment: req.body.comment,
        heading: utilityFunctions.getMachineTypeName(req.body.type)
      };
      db.machine.find ({
        $and : [ { m_no: req.body.m_no },
                {
                  bearing: { $elemMatch: { type : req.body.type, date: date } }
                }]
      }).projection({m_no : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('machineSection/add_machine_entry', doc_response);
        } else if(docs.length > 0) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>Machine :- "${req.body.m_no}" : "${utilityFunctions.getMachineTypeName(req.body.type)} > Bearing" Already Exists on This date</div>`;
            res.render('machineSection/add_machine_entry', doc_response);
        } else {
            db.machine.update({
                  m_no: req.body.m_no
                }, {
                  $push: {
                    bearing : {
                      date: date,
                      make: req.body.make,
                      comment: req.body.comment,
                      type: req.body.type
                    }
                  },
                }, {
                  upsert: false,
                  multi: false
                }, function (err, numAffected, affectedDocuments, upsert) {
                      if (err || numAffected == 0) {
                          doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${(err)?(err.message):('The Machine Does Not Exist')}</div>`;
                          res.render('machineSection/add_machine_entry', doc_response);
                      } else {
                          doc_response.message = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>SUCCESS!</strong> Added Entry Sucessfully</div>`;
                          res.render('machineSection/add_machine_entry', doc_response);
                        }
                  });
              }
          });
      }
});

//middleware to view a machine details
router.get('/viewMachineBearing', function(req, res, next) {
  res.render('machineSection/view_machine_bearing', {
        machine : "",
        startingDate : "",
        endingDate : "",
        message : "",
        error: ""
  });
});

router.post('/viewMachineBearing', function(req, res, next) {
  if(!req.body.startingDate || !req.body.endingDate || !req.body.m_no)
    res.redirect('/machineSection');
  else {
    var doc_response = {
      machine : req.body.m_no,
      startingDate : req.body.startingDate,
      endingDate : req.body.endingDate,
      error : "",
      message : ""
    };

    req.body.startingDate = (new Date(req.body.startingDate));
    req.body.endingDate = (new Date(req.body.endingDate));

  db.machine.find ({
      $and : [ {
                  m_no: req.body.m_no
               },
              {
                "bearing.date": { $gte: req.body.startingDate }
              },
              {
                "bearing.date": { $lte: req.body.endingDate }
              }
             ]
  }).projection({bearing : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('machineSection/view_machine_bearing', doc_response);
        } else if(docs.length > 1) {  // multiple documents found
              doc_response.error = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Multiple Machines With The Same Name Found!</strong></div>`;
              res.render('machineSection/view_machine_bearing', doc_response);
        } else if(docs.length === 0 || docs[0].bearing.length === 0 || req.body.startingDate > req.body.endingDate) {  // no documents found
              doc_response.error = `<div class="alert alert-dismissable alert-warning fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>No Entry Found In The Given Time Frame!</strong></div>`;
              res.render('machineSection/view_machine_bearing', doc_response);
        } else {
              doc_response.message = utilityFunctions.machineBearingMakeTable(docs[0].bearing,req.body.startingDate,req.body.endingDate);
              res.render('machineSection/view_machine_bearing', doc_response);
          }
      });
    }
});

/* ************************************************************ */
/* Bearing Section Ends  */


/* ************************************************************ */
/* Back Up Roll Ends  */

//middlewares to add  machine back up roll entry
router.get('/addMachineBackUpRollEntry', function (req, res, next) {
      if(!req.query.type)
        res.redirect('/machineSection');
      else
        res.render('machineSection/add_back_up_roll_entry', {
          type: req.query.type,
          machine: '',
          date: '',
          dia: '',
          comment: '',
          message: ''
      });
});

router.post('/addMachineBackUpRollEntry', function(req, res, next) {
  if(!req.body.date || !req.body.type ||  !req.body.dia || !req.body.m_no)
    res.redirect('/machineSection');
  else {
    var date = new Date(req.body.date),
        doc_response = {
          type: req.body.type,
          machine: req.body.m_no,
          date: req.body.date,
          dia : req.body.dia,
          comment: req.body.comment,
          message: ''
        };
      db.machine.find ({
        $and : [ { m_no: req.body.m_no },
                {
                  roll: { $elemMatch: { type : req.body.type, date: date } }
                }]
      }).projection({m_no : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('machineSection/add_back_up_roll_entry', doc_response);
        } else if(docs.length > 0) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>Machine :- "${req.body.m_no}" Back Up Roll ${req.body.type} Already Exists on This date</div>`;
            res.render('machineSection/add_back_up_roll_entry', doc_response);
        } else {
            db.machine.update({
                  m_no: req.body.m_no
                }, {
                  $push: {
                    roll : {
                      date: date,
                      dia : req.body.dia,
                      comment: req.body.comment,
                      type: req.body.type
                    }
                  },
                }, {
                  upsert: false,
                  multi: false
                }, function (err, numAffected, affectedDocuments, upsert) {
                      if (err || numAffected == 0) {
                          doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${(err)?(err.message):('The Machine Does Not Exist')}</div>`;
                          res.render('machineSection/add_back_up_roll_entry', doc_response);
                      } else {
                          doc_response.message = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>SUCCESS!</strong> Added Entry Sucessfully</div>`;
                          res.render('machineSection/add_back_up_roll_entry', doc_response);
                        }
                  });
              }
          });
      }
});

//middleware to view a machine details
router.get('/viewMachineBackUpRoll', function(req, res, next) {
  res.render('machineSection/view_machine_back_up_roll', {
        machine : "",
        startingDate : "",
        endingDate : "",
        message : "",
        error: ""
  });
});

router.post('/viewMachineBackUpRoll', function(req, res, next) {
  if(!req.body.startingDate || !req.body.endingDate || !req.body.m_no)
    res.redirect('/machineSection');
  else {
  var doc_response = {
    machine : req.body.m_no,
    startingDate : req.body.startingDate,
    endingDate : req.body.endingDate,
    error : "",
    message : ""
  };

  req.body.startingDate = new Date(req.body.startingDate);
  req.body.endingDate = new Date(req.body.endingDate);

  db.machine.find ({
      $and : [ {
                  m_no: req.body.m_no
               },
              {
                "roll.date": { $gte: req.body.startingDate }
              },
              {
                "roll.date": { $lte: req.body.endingDate }
              }
             ]
      }).projection({roll : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('machineSection/view_machine_back_up_roll', doc_response);
        } else if(docs.length > 1) {  // multiple documents found
              doc_response.error = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Multiple Machines With The Same Name Found!</strong></div>`;
              res.render('machineSection/view_machine_back_up_roll', doc_response);
        } else if(docs.length === 0 || docs[0].roll.length === 0 || req.body.startingDate > req.body.endingDate) {  // no documents found
              doc_response.error = `<div class="alert alert-dismissable alert-warning fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>No Entry Found In The Given Time Frame!</strong></div>`;
              res.render('machineSection/view_machine_back_up_roll', doc_response);
        } else {
            doc_response.message = utilityFunctions.machineBackUpRollMakeTable(docs[0].roll, req.body.startingDate, req.body.endingDate);
            res.render('machineSection/view_machine_back_up_roll', doc_response);
          }
      });
    }
});
module.exports = router;
