const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      url = require('url'),
      utilityFunctions = require('./functions.js'),
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
            }, { multi:false}, function(err, numRemoved) {
                  if(err || numRemoved == 0)
                      res.redirect(`/updateEntry/deleteName?type=${req.query.type}&name=${req.query.name}&message=ERROR!%20%3C/strong%3E${((err)?err.message:"Machine%20Not%20Found")}`);
                  else
                    res.redirect(`/updateEntry/deleteName?type=${req.query.type}&name=${req.query.name}&message=SUCCESS!%20%3C/strong%3EDeleted Successfully`);
              });
          } else if(req.query.type === "roll") {
                db.workroll.remove ({
                    roll: req.query.name
                }, { multi:false}, function(err, numRemoved) {
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

router.get('/updateBearingEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.index || !req.query.type || !req.query.name || !req.query.date || !req.query.make || !req.query.comment)
        res.redirect('/updateEntry/home');
      else {
        res.render('updateEntry/update_bearing_entry', {
              index: req.query.index,
              type : req.query.type,
              name : req.query.name,
              date : req.query.date,
              make: req.query.make,
              comment: req.query.comment,
              message : ""
            });
        }
    }
});
/* UPDATE BACK UP ROLL */
router.post('/updateBearingEntry', function (req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else if(!req.body.name || !req.body.date ||  !req.body.make || !req.body.comment || !req.body.type || !req.body.index ||  !req.body.oldname)
    res.redirect('/updateEntry/home');
  else {
    var doc_response = {
          index: req.body.index,
          type : req.body.type,
          name : req.body.oldname,
          date : req.body.date,
          make: req.body.make,
          comment: req.body.comment,
          message : ""
        },
        findJSON = {};
      if(req.body.name === req.body.oldname)
        findJSON.m_no = req.body.name;
      else
        findJSON.$or = [{m_no: req.body.oldname}, {m_no: req.body.name}];

      db.machine.find (findJSON).projection({bearing : 1, m_no: 1}).exec(function(err, docs) {
        if(err || docs.length === 0) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Entry Not Found")}</div>`;
            res.render('updateEntry/update_bearing_entry', doc_response);
        } else {
            if(docs.length === 1) { //same machine names
              let len = docs[0].bearing.length,
                  checkTime = new Date(req.body.date).getTime();
              req.body.index = parseInt(req.body.index);

              for(i = 0; i < len; ++i) {  //checking for contradiction of data
                  if(i === req.body.index) {
                    continue;
                  }
                  if(docs[0].bearing[i].type === req.body.type && (new Date(docs[0].bearing[i].date)).getTime() == checkTime ) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in">
                      <a aria-label=close class=close data-dismiss=alert href=#>×</a>
                        <strong>ERROR! </strong>
                          Updated Entry Conflicts With Already Present Value.
                          <br>
                          Date : ${docs[0].bearing[i].date} <br>
                          Type : ${utilityFunctions.getMachineTypeName(docs[0].bearing[i].type)} <br>
                          Make : ${docs[0].bearing[i].make} <br>
                          Comment : ${docs[0].bearing[i].comment} <br>
                          </div>`;
                    res.render('updateEntry/update_bearing_entry', doc_response);
                    return;
                  }
              }
              // updating entry
              docs[0].bearing[req.body.index].date = new Date(req.body.date);
              docs[0].bearing[req.body.index].type = req.body.type;
              docs[0].bearing[req.body.index].make = req.body.make;
              docs[0].bearing[req.body.index].comment =req.body.comment;

              db.machine.update({ m_no: req.body.oldname }, { $set: { bearing: docs[0].bearing } }, { multi: false, upsert: false }, function (err, numReplaced) {
                if(err || numReplaced === 0) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Error In Updating Same Name Entry")}</div>`;
                    res.render('updateEntry/update_bearing_entry', doc_response);
                } else
                    res.redirect(`/updateEntry/updateExistingEntry?type=m_no&name=${req.body.oldname}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
              });
            } else if(docs.length === 2) {
              var oldArray,
                  newArray;

              if(docs[0].m_no === req.body.oldname) {
                oldArray = docs[0].bearing;
                newArray = docs[1].bearing;
              } else {
                oldArray = docs[1].bearing;
                newArray = docs[0].bearing;
              }

              let len = newArray.length,
                  checkTime = new Date(req.body.date).getTime();

              for(i = 0; i < len; ++i) {  //checking for contradiction of data
                  if(newArray[i].type === req.body.type && (newArray[i].date).getTime() === checkTime ) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in">
                      <a aria-label=close class=close data-dismiss=alert href=#>×</a>
                        <strong>ERROR! </strong>
                          Updated Entry Conflicts With Already Present Value.
                          <br>
                          Date : ${newArray[i].date} <br>
                          Type : ${utilityFunctions.getMachineTypeName(newArray[i].type)} <br>
                          Make : ${newArray[i].make} <br>
                          Comment : ${newArray[i].comment} <br>
                          </div>`;
                    res.render('updateEntry/update_bearing_entry', doc_response);
                    return;
                  }
              }
              // updating entry
              oldArray.splice(parseInt(req.body.index), 1);
              newArray.push({
                date : new Date(req.body.date),
                type : req.body.type,
                make : req.body.make,
                comment : req.body.comment
              });

              db.machine.update({ m_no: req.body.oldname }, { $set: { bearing: oldArray } }, { multi: false, upsert: false }, function (err, numReplaced) {
                if(err || numReplaced === 0) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Some Error Occured While Deleting Old Entry")}</div>`;
                    res.render('updateEntry/update_bearing_entry', doc_response);
                } else {
                  db.machine.update({ m_no: req.body.name }, { $set: { bearing: newArray } }, { multi: false, upsert: false }, function (err, numReplaced) {
                    if(err || numReplaced === 0) {
                        doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Some Error Occured While Inserting New Entry")}</div>`;
                        res.render('updateEntry/update_bearing_entry', doc_response);
                    } else {
                      res.redirect(`/updateEntry/updateExistingEntry?type=m_no&name=${req.body.name}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
                    }
                  });
                }
              });
            }
            else {
              doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Both The Entries Not Found")}</div>`;
              res.render('updateEntry/update_bearing_entry', doc_response);
            }
        }
      });
    }
});

router.get('/updateBackUpRollEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.index || !req.query.type || !req.query.name || !req.query.date || !req.query.dia || !req.query.comment)
        res.redirect('/updateEntry/home');
      else {
        res.render('updateEntry/update_backup_entry', {
              index: req.query.index,
              type : req.query.type,
              name : req.query.name,
              date : req.query.date,
              dia: req.query.dia,
              comment: req.query.comment,
              message : ""
            });
        }
    }
});

router.post('/updateBackUpRollEntry', function (req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else if(!req.body.name || !req.body.date ||  !req.body.dia || !req.body.comment || !req.body.type || !req.body.index ||  !req.body.oldname)
    res.redirect('/updateEntry/home');
  else {
    var doc_response = {
          index: req.body.index,
          type : req.body.type,
          name : req.body.oldname,
          date : req.body.date,
          dia: req.body.dia,
          comment: req.body.comment,
          message : ""
        },
        findJSON = {};
      if(req.body.name === req.body.oldname)
        findJSON.m_no = req.body.name;
      else
        findJSON.$or = [{m_no: req.body.oldname}, {m_no: req.body.name}];

      db.machine.find (findJSON).projection({roll : 1, m_no: 1}).exec(function(err, docs) {
        if(err || docs.length === 0) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Entry Not Found")}</div>`;
            res.render('updateEntry/update_backup_entry', doc_response);
        } else {
            if(docs.length === 1) { //same machine names
              let len = docs[0].roll.length,
                  checkTime = new Date(req.body.date).getTime();
              req.body.index = parseInt(req.body.index);

              for(i = 0; i < len; ++i) {  //checking for contradiction of data
                  if(i === req.body.index) {
                    continue;
                  }
                  if(docs[0].roll[i].type === req.body.type && (new Date(docs[0].roll[i].date)).getTime() == checkTime ) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in">
                      <a aria-label=close class=close data-dismiss=alert href=#>×</a>
                        <strong>ERROR! </strong>
                          Updated Entry Conflicts With Already Present Value.
                          <br>
                          Date : ${docs[0].roll[i].date} <br>
                          Type : ${docs[0].roll[i].type} <br>
                          Dia : ${docs[0].roll[i].dia} <br>
                          Comment : ${docs[0].roll[i].comment} <br>
                          </div>`;
                    res.render('updateEntry/update_backup_entry', doc_response);
                    return;
                  }
              }
              // updating entry
              docs[0].roll[req.body.index].date = new Date(req.body.date);
              docs[0].roll[req.body.index].type = req.body.type;
              docs[0].roll[req.body.index].dia = req.body.dia;
              docs[0].roll[req.body.index].comment =req.body.comment;

              db.machine.update({ m_no: req.body.oldname }, { $set: { roll: docs[0].roll } }, { multi: false, upsert: false }, function (err, numReplaced) {
                if(err || numReplaced === 0) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Entry Not Found")}</div>`;
                    res.render('updateEntry/update_backup_entry', doc_response);
                } else
                    res.redirect(`/updateEntry/updateExistingEntry?type=m_no&name=${req.body.oldname}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
              });
            } else if(docs.length === 2) {
              var oldArray,
                  newArray;

              if(docs[0].m_no === req.body.oldname) {
                oldArray = docs[0].roll;
                newArray = docs[1].roll;
              } else {
                oldArray = docs[1].roll;
                newArray = docs[0].roll;
              }

              let len = newArray.length,
                  checkTime = new Date(req.body.date).getTime();

              for(i = 0; i < len; ++i) {  //checking for contradiction of data
                  if(newArray[i].type === req.body.type && (newArray[i].date).getTime() === checkTime ) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in">
                      <a aria-label=close class=close data-dismiss=alert href=#>×</a>
                        <strong>ERROR! </strong>
                          Updated Entry Conflicts With Already Present Value.
                          <br>
                          Date : ${newArray[i].date} <br>
                          Type : ${newArray[i].type} <br>
                          Dia : ${newArray[i].dia} <br>
                          Comment : ${newArray[i].comment} <br>
                          </div>`;
                    res.render('updateEntry/update_backup_entry', doc_response);
                    return;
                  }
              }
              // updating entry
              oldArray.splice(parseInt(req.body.index), 1);
              newArray.push({
                date : new Date(req.body.date),
                type : req.body.type,
                dia : req.body.dia,
                comment : req.body.comment
              });

              db.machine.update({ m_no: req.body.oldname }, { $set: { roll: oldArray } }, { multi: false, upsert: false }, function (err, numReplaced) {
                if(err || numReplaced === 0) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Some Error Occured While Deleting Old Entry")}</div>`;
                    res.render('updateEntry/update_backup_entry', doc_response);
                } else {
                  db.machine.update({ m_no: req.body.name }, { $set: { roll: newArray } }, { multi: false, upsert: false }, function (err, numReplaced) {
                    if(err || numReplaced === 0) {
                        doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Some Error Occured While Inserting New Entry")}</div>`;
                        res.render('updateEntry/update_backup_entry', doc_response);
                    } else {
                      res.redirect(`/updateEntry/updateExistingEntry?type=m_no&name=${req.body.name}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
                    }
                  });
                }
              });
            }
            else {
              doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Both The Entries Not Found")}</div>`;
              res.render('updateEntry/update_backup_entry', doc_response);
            }
        }
      });
    }
});


router.get('/updateWorkRollEntry', function (req, res, next) {
    if(!req.session.loggedin)
      res.redirect('/updateEntry');
    else {
      if(!req.query.index || !req.query.name || !req.query.m_no || !req.query.m_down || !req.query.reason ||
         !req.query.g_time || !req.query.dia || !req.query.operator || !req.query.comment)
        res.redirect('/updateEntry/home');
      else {
        res.render('updateEntry/update_roll_entry', {
              index: req.query.index,
              name : req.query.name,
              m_no : req.query.m_no,
              m_up : req.query.m_up,
              m_down : req.query.m_down,
              reason : req.query.reason,
              g_time : req.query.g_time,
              dia : req.query.dia,
              operator: req.query.operator,
              comment: req.query.comment,
              message : ""
            });
        }
    }
});
/* UPDATE BACK UP ROLL */
router.post('/updateWorkRollEntry', function (req, res, next) {
  if(!req.session.loggedin)
      res.redirect('/updateEntry');
  else if(!req.body.index || !req.body.name || !req.body.m_no ||  !req.body.m_up || !req.body.m_down || !req.body.reason || !req.body.g_time ||  !req.body.dia ||
          !req.body.operator || !req.body.comment ||  !req.body.oldname )
    res.redirect('/updateEntry/home');
  else {
    var doc_response = {
        index: req.body.index,
        name : req.body.name,
        m_no : req.body.m_no,
        m_up : req.body.m_up,
        m_down : req.body.m_down,
        reason : req.body.reason,
        g_time : req.body.g_time,
        dia : req.body.dia,
        operator: req.body.operator,
        comment: req.body.comment,
        message : ""
        },
        findJSON = {};
      if(req.body.name === req.body.oldname)
        findJSON.roll = req.body.name;
      else
        findJSON.$or = [{roll: req.body.oldname}, {roll: req.body.name}];

      db.workroll.find (findJSON).projection({field : 1, roll: 1}).exec(function(err, docs) {
        if(err || docs.length === 0) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Entry Not Found")}</div>`;
            res.render('updateEntry/update_roll_entry', doc_response);
        } else {
            if(docs.length === 1) { //same roll names
              req.body.index = parseInt(req.body.index);
              // updating entry
              docs[0].field[req.body.index].m_no = req.body.m_no;
              docs[0].field[req.body.index].m_up = new Date(req.body.m_up);
              docs[0].field[req.body.index].m_down = new Date(req.body.m_down);
              docs[0].field[req.body.index].reason = req.body.reason;
              docs[0].field[req.body.index].g_time = new Date(req.body.g_time);
              docs[0].field[req.body.index].dia = req.body.dia;
              docs[0].field[req.body.index].operator = req.body.operator;
              docs[0].field[req.body.index].comment = req.body.comment;

              db.workroll.update({ roll: req.body.oldname }, { $set: { field: docs[0].field } }, { multi: false, upsert: false }, function (err, numReplaced) {
                if(err || numReplaced === 0) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Error In Updating Same Name Entry")}</div>`;
                    res.render('updateEntry/update_roll_entry', doc_response);
                } else
                    res.redirect(`/updateEntry/updateExistingEntry?type=roll&name=${req.body.oldname}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
              });
            } else if(docs.length === 2) {
              var oldArray,
                  newArray;

              if(docs[0].roll === req.body.oldname) {
                oldArray = docs[0].field;
                newArray = docs[1].field;
              } else {
                oldArray = docs[1].field;
                newArray = docs[0].field;
              }

              // updating entry
              oldArray.splice(parseInt(req.body.index), 1);
              newArray.push({
                  m_no : req.body.m_no,
                  m_up : new Date(req.body.m_up),
                  m_down : new Date(req.body.m_down),
                  reason : req.body.reason,
                  g_time : new Date(req.body.g_time),
                  dia : req.body.dia,
                  operator: req.body.operator,
                  comment: req.body.comment
              });

              db.workroll.update({ roll: req.body.oldname }, { $set: { field: oldArray } }, { multi: false, upsert: false }, function (err, numReplaced) {
                if(err || numReplaced === 0) {
                    doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Some Error Occured While Deleting Old Entry")}</div>`;
                    res.render('updateEntry/update_roll_entry', doc_response);
                } else {
                  db.workroll.update({ roll: req.body.name }, { $set: { field: newArray } }, { multi: false, upsert: false }, function (err, numReplaced) {
                    if(err || numReplaced === 0) {
                        doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Some Error Occured While Inserting New Entry")}</div>`;
                        res.render('updateEntry/update_roll_entry', doc_response);
                    } else {
                      res.redirect(`/updateEntry/updateExistingEntry?type=roll&name=${req.body.name}&message=SUCCESS!%20%3C/strong%3EModified%20Successfully`);
                    }
                  });
                }
              });
            }
            else {
              doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${((err)?err.message:"Both The Entries Not Found")}</div>`;
              res.render('updateEntry/update_roll_entry', doc_response);
            }
        }
      });
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
            } } }, {multi : false, upsert : false}, function(err, numRemoved) {
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
            } } }, {multi : false, upsert : false}, function(err, numRemoved) {
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
            } } }, {multi : false, upsert : false}, function(err, numRemoved) {
                  if(err || numRemoved == 0)
                      res.redirect(`/updateEntry/deleteExistingEntry?type=roll&name=${req.query.rollname}&message=ERROR!%20%3C/strong%3E${((err)?err.message:"Entry%20Not%20Found")}`);
                  else
                      res.redirect(`/updateEntry/deleteExistingEntry?type=roll&name=${req.query.rollname}&message=SUCCESS!%20%3C/strong%3EDeleted%20Work%20Roll%20Entry%20Successfully`);
              });
          }
      }
});

module.exports = router;
