const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      url = require('url'),
      utilityFunctions = require('./functions.js'),
      router = express.Router();

var db = require('./db.js');

router.get('/', function (req, res, next) {
    res.render('workrollSection/index');
});

//middlewares to add new work roll
router.get('/addNewWorkRoll', function (req, res, next) {
    res.render('workrollSection/add_new_work_roll' , {
        roll: '',
        message: '',
    });
});

router.post('/addNewWorkRoll', function (req, res, next) {
    if(!req.body.roll)
      res.redirect('/workrollSection');
    else {
    db.workroll.insert({
        roll: req.body.roll,
        field: [],
        status: "new"
    }, function (err, newDoc) {
        if (err) {
          res.render('workrollSection/add_new_work_roll' , {
            roll: req.body.roll,
            message: `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR!</strong> ${err.message}</div>`,
          });
        } else {
          res.render('workrollSection/add_new_work_roll' , {
            roll: req.body.roll,
            message: `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>SUCCESS!</strong> Added Entry Sucessfully</div>`,
          });
        }
    });
  }
});

//middlewares to add work roll entry
router.get('/addWorkRollEntry', function (req, res, next) {
        res.render('workrollSection/add_workroll_entry' , {
          roll: '',
          m_no: '',
          m_up: '',
          m_down: '',
          reason: '',
          g_time: '',
          dia: '',
          operator: '',
          comment: '',
          message: ''
      });
});

router.post('/addWorkRollEntry', function(req, res, next) {
  console.log(req.body);
  if(!req.body.roll || !req.body.m_no || !req.body.m_up || !req.body.m_down || !req.body.reason ||
     !req.body.g_time || !req.body.dia || !req.body.operator)
      res.redirect('/workrollSection');
  else {
        req.body.comment = (req.body.comment)? req.body.comment:'';
        doc_response = {
          roll: req.body.roll,
          m_no: req.body.m_no,
          m_up: req.body.m_up,
          m_down: req.body.m_down,
          reason: req.body.reason,
          g_time: req.body.g_time,
          dia: req.body.dia,
          operator: req.body.operator,
          comment: req.body.comment,
          message: ''
      };
      db.workroll.find ({
        $and : [ { roll: req.body.roll },
                 { status: "new" }
               ]
      }).projection({roll : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('workrollSection/add_workroll_entry' , doc_response);
        } else if(docs.length === 0) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>Either Work Roll "${req.body.roll}" Is Old Or It Does Not Exist</div>`;
            res.render('workrollSection/add_workroll_entry' , doc_response);
        } else {
            db.workroll.update({
                  roll: req.body.roll
                }, {
                  $push: {
                    field : {
                      m_no: req.body.m_no,
                      m_up: new Date(req.body.m_up),
                      m_down: new Date(req.body.m_down),
                      reason: req.body.reason,
                      g_time: new Date(req.body.g_time),
                      dia: req.body.dia,
                      operator: req.body.operator,
                      comment: req.body.comment
                    }
                  },
                }, {
                  upsert: false,
                  multi: false
                }, function (err, numAffected, affectedDocuments, upsert) {
                      if (err || numAffected == 0) {
                          doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${(err)?(err.message):('Either The Work Roll Is Old Or It Does Not Exist')}</div>`;
                          res.render('workrollSection/add_workroll_entry' , doc_response);
                      } else {
                          doc_response.message = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>SUCCESS!</strong> Added Entry Sucessfully</div>`;
                          res.render('workrollSection/add_workroll_entry' , doc_response);
                        }
                  });
              }
          });
      }
});

//middlewares to make and view work roll old
router.get('/changeRollStatus', function (req, res, next) {
  if(!req.query.status)
    res.redirect('/workrollSection');
  else {
    res.render('workrollSection/change_work_roll_status' , {
        roll: '',
        status: req.query.status,
        message: '',
    });
  }
});

router.post('/changeRollStatus', function (req, res, next) {
    if(!req.body.roll || !req.body.status)
      res.redirect('/workrollSection');
    else {
      db.workroll.update({
            roll: req.body.roll
          },{
              $set: { status: req.body.status }
          },{
            upsert: false,
            multi: false
          }, function (err, numAffected, affectedDocuments, upsert) {
                if (err || numAffected == 0) {
                    res.render('workrollSection/change_work_roll_status' , {
                        roll : req.body.roll,
                        status: req.body.status,
                        message : `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${(err)?(err.message):('The Work Roll Does Not Exist')}</div>`
                    });
                } else {
                    res.render('workrollSection/change_work_roll_status' , {
                        roll : req.body.roll,
                        status: req.body.status,
                        message : `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>SUCCESS!</strong> Modified Entry Sucessfully</div>`
                    });
                  }
            });
        }
});

router.get('/viewOldWorkRoll', function (req, res, next) {
  db.workroll.find ({
     status: "old"
  }).projection({roll : 1}).sort({roll : 1}).exec(function(err, docs) {
    if(err) {
        res.render('workrollSection/view_old_work_roll' , {
            message : `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`
        });
    } else if(docs.length === 0) {
        res.render('workrollSection/view_old_work_roll' , {
          message :`<div class="alert alert-success alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>No Old Work Roll Found</strong></div>`
        });
    } else {
      var i = 0,
          len = docs.length;
          htmlToSend = `<div class="container-fluid"><table class="table table-bordered table-condensed table-hover table-striped">`;
      for (i = 0; i < len; i+=2) {
        htmlToSend += `<tr><td style="text-align:center;border: thin solid black;" class="success">${docs[i].roll}</td><td style="text-align:center;border: thin solid black;" class="info">${(i < len-1)?(docs[i+1].roll):'&nbsp;'}</td></tr>`;
      }
      res.render('workrollSection/view_old_work_roll' , {
        message: htmlToSend,
      });
    }
  });
});


// middlewares to view work roll details

router.get('/viewWorkRoll', function(req, res, next) {
  res.render('workrollSection/view_work_roll' , {
        roll : "",
        startingDate : "",
        endingDate : "",
        message : "",
        error: ""
  });
});

router.post('/viewWorkRoll', function(req, res, next) {
  if(!req.body.startingDate || !req.body.endingDate || !req.body.roll)
    res.redirect('/workrollSection');
  else {
  var starting_date = (new Date(req.body.startingDate)).getTime(),
      ending_date = (new Date(req.body.endingDate)).getTime(),
      doc_response = {};

      doc_response.roll = req.body.roll;
      doc_response.startingDate = req.body.startingDate;
      doc_response.endingDate = req.body.endingDate;
      doc_response.error = "";
      doc_response.message = "";

  db.workroll.find ({
      $and : [ {
                  roll: req.body.roll
               },
              {
                "field.g_time": { $gte: new Date(req.body.startingDate) }
              },
              {
                "field.g_time": { $lte: new Date(req.body.endingDate) }
              }
             ]
      }).projection({field : 1, status : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('workrollSection/view_work_roll' , doc_response);
        } else if(docs.length > 1) {  // multiple documents found
              doc_response.error = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Multiple Work Rolls With The Same Name Found!</strong></div>`;
              res.render('workrollSection/view_work_roll' , doc_response);
        } else if(docs.length === 0 || docs[0].field.length === 0 || starting_date > ending_date) {  // no documents found
              doc_response.error = `<div class="alert alert-dismissable alert-warning fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>No Entry Found In The Given Time Frame!</strong></div>`;
              res.render('workrollSection/view_work_roll' , doc_response);
        } else {
            docs[0].field.sort(function(a, b){
              return a.g_time - b.g_time;
              });
            var len = docs[0].field.length,
                i = 0,
                htmlToSend = `<pre class="container" style="text-align:center;"><h5>WORK ROLL STATUS :- ${docs[0].status}</h5></pre><div class="table container-fluid"><table class="table table-bordered table-condensed table-striped"><tr><th>S No.<th>Mach. No.<th colspan=2>Mach. Up<th colspan=2>Mach. Down<th>Working Time<th style="border-right: thick solid red;">Reason<th colspan=2>Grinding Time<th>Cooling Time<th>Diameter<th>Grinding Operator<th>Comment<tr style="border-bottom: thick solid black;"><th><th><th>Date<th>Time<th>Date<th>Time<th><th style="border-right: thick solid red;"><th>Date<th>Time<th>Cooling Time<th><th><th></tr>`;

            // filling the table
            let counter = 1;
            for (i = 0; i < len; ++i) {
                let curr_date = docs[0].field[i].g_time.getTime();
                if(curr_date < starting_date || curr_date > ending_date)
                  continue;

                htmlToSend += `<tr>
                                   <td>${counter++}</td>
                                   <td>${docs[0].field[i].m_no}</td>
                                   <td>${utilityFunctions.formattedDate(docs[0].field[i].m_up)}</td>
                                   <td>${utilityFunctions.formattedTime(docs[0].field[i].m_up)}</td>
                                   <td>${utilityFunctions.formattedDate(docs[0].field[i].m_down)}</td>
                                   <td>${utilityFunctions.formattedTime(docs[0].field[i].m_down)}</td>
                                   <td>${utilityFunctions.timeDiff(docs[0].field[i].m_down,docs[0].field[i].m_up)}</td>
                                   <td style="border-right: thick solid red;">${docs[0].field[i].reason}</td>
                                   <td>${utilityFunctions.formattedDate(docs[0].field[i].g_time)}</td>
                                   <td>${utilityFunctions.formattedTime(docs[0].field[i].g_time)}</td>
                                   <td>${utilityFunctions.timeDiff(docs[0].field[i].g_time,docs[0].field[i].m_down)}</td>
                                   <td>${docs[0].field[i].dia}</td>
                                   <td>${docs[0].field[i].operator}</td>
                                   <td>${docs[0].field[i].comment}</td>
                              </tr>`;
            }
            htmlToSend += `</table></div>`;
            doc_response.message = htmlToSend;
            res.render('workrollSection/view_work_roll' , doc_response);
          }
      });
    }
});
module.exports = router;
