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

/* ************************************************************ */
/* WorkRoll Section Begins  */

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

//middlewares to add  machine bearing entry
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
  if(!req.body.roll || !req.body.m_no || !req.body.m_up || !req.body.m_down || !req.body.reason ||
     !req.body.g_time || !req.body.dia || !req.body.operator || !req.body.comment)
      res.redirect('/workrollSection');
  else {
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


//middlewares to make work roll old
router.get('/makeRollOld', function (req, res, next) {
    res.render('workrollSection/add_new_work_roll' , {
        roll: '',
        message: '',
    });
});

router.post('/makeRollOld', function (req, res, next) {
    if(!req.body.roll)
      res.redirect('/workrollSection');
    else {
      db.workroll.update({
            roll: req.body.roll
          },{
              $set: { status: 'old' }
          },{
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

//middleware to view a machine details
router.get('/viewMachineBearing', function(req, res, next) {
  res.render('workrollSection/view_machine_bearing' , {
        machine : "",
        startingDate : "",
        endingDate : "",
        message : "",
        error: ""
  });
});

router.post('/viewMachineBearing', function(req, res, next) {
  if(!req.body.startingDate || !req.body.endingDate || !req.body.m_no)
    res.redirect('/workrollSection');
  else {
  var starting_date = (new Date(req.body.startingDate)).getTime(),
      ending_date = (new Date(req.body.endingDate)).getTime(),
      m_no = req.body.m_no,
      doc_response = {};

  doc_response.machine = m_no;
  doc_response.startingDate = req.body.startingDate;
  doc_response.endingDate = req.body.endingDate;
  doc_response.error = "";
  doc_response.message = "";

  db.workroll.find ({
      $and : [ {
                  m_no: req.body.m_no
               },
              {
                "bearing.date": { $gte: new Date(req.body.startingDate) }
              },
              {
                "bearing.date": { $lte: new Date(req.body.endingDate) }
              }
             ]
  }).projection({bearing : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('workrollSection/view_machine_bearing' , doc_response);
        } else if(docs.length > 1) {  // multiple documents found
              doc_response.error = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Multiple Machines With The Same Name Found!</strong></div>`;
              res.render('workrollSection/view_machine_bearing' , doc_response);
        } else if(docs.length === 0 || docs[0].bearing.length === 0 || starting_date > ending_date) {  // no documents found
              doc_response.error = `<div class="alert alert-dismissable alert-warning fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>No Entry Found In The Given Time Frame!</strong></div>`;
              res.render('workrollSection/view_machine_bearing' , doc_response);
        } else {
            docs[0].bearing.sort(function(a, b){
              return a.date - b.date;
              });
            // arrays to hold unique entry for each bearing sorted by date
            var DDO = [], DDI = [] ,
                DUO = [], DUI = [] ,
                GDO = [], GDI = [] ,
                GUO = [], GUI = [] ,
                unique_date = [],  // array to store the unique dates sorted by date
                len = docs[0].bearing.length,
                unique_date_len = 0,
                i = 0;

            // filling the arrays
            for (i = 0; i < len; ++i) {
                unique_date_len = unique_date.length;
                let curr_date = (docs[0].bearing[i].date).getTime();
                if(curr_date < starting_date || curr_date > ending_date)
                  continue;

                switch(docs[0].bearing[i].type) {
                  case "ddo" : DDO.push(docs[0].bearing[i]);
                               break;
                  case "ddi" : DDI.push(docs[0].bearing[i]);
                              break;
                  case "duo" : DUO.push(docs[0].bearing[i]);
                               break;
                  case "dui" : DUI.push(docs[0].bearing[i]);
                               break;
                  case "gdo" : GDO.push(docs[0].bearing[i]);
                               break;
                  case "gdi" : GDI.push(docs[0].bearing[i]);
                               break;
                  case "guo" : GUO.push(docs[0].bearing[i]);
                               break;
                  case "gui" : GUI.push(docs[0].bearing[i]);
                               break;
                  default : console.log("ERROR in Type Array Creation");
                            doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
                            res.render('workrollSection/view_machine_bearing' , doc_response);
                }
                if(unique_date_len === 0) {
                  unique_date.push(docs[0].bearing[i].date);
                } else if(curr_date !== (unique_date[unique_date_len-1]).getTime())  //checking for duplicacity
                    unique_date.push(docs[0].bearing[i].date);
            }
            unique_date_len = unique_date.length;

          var htmlToSend = `<div class="table container-fluid"><table class="table table-bordered table-condensed table-striped"><tr><th>S No.<th>Date<th colspan=6  style="border-right: thick outset red;">Dab Side Up<th colspan=6 scope=col>Dab Side Down<th class=emptyInMiddle><th colspan=6 style="border-right: thick outset red;">Gear Side Up<th colspan=6 scope=col>Gear Side Down<tr><th><th><th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3 style="border-right: thick outset red;">OUT<th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3 scope=col>OUT<th class=emptyInMiddle><th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3 style="border-right: thick outset red;">OUT<th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3>OUT<tr style="border-bottom:medium solid #000"><th><th><th>make<th>cmt<th style="border-right: thick outset blue;">diff<th>make<th>cmt<th style="border-right: thick outset red;">diff<th>make<th>cmt<th style="border-right: thick outset blue;">diff<th>make<th>cmt<th>diff<th class=emptyInMiddle><th>make<th>cmt<th  style="border-right: thick outset blue;">diff<th>make<th>cmt<th  style="border-right: thick outset red;">diff<th>make<th>cmt<th  style="border-right: thick outset blue;">diff<th>make<th>cmt<th>diff</tr>`;

          // filling the arrays for the various types
          var DDO_ans = makeTableBearing(unique_date, unique_date_len, DDO),
              DDI_ans = makeTableBearing(unique_date, unique_date_len, DDI),
              DUO_ans = makeTableBearing(unique_date, unique_date_len, DUO),
              DUI_ans = makeTableBearing(unique_date, unique_date_len, DUI),

              GDO_ans = makeTableBearing(unique_date, unique_date_len, GDO),
              GDI_ans = makeTableBearing(unique_date, unique_date_len, GDI),
              GUO_ans = makeTableBearing(unique_date, unique_date_len, GUO),
              GUI_ans = makeTableBearing(unique_date, unique_date_len, GUI);

          for (i = 0; i < unique_date_len; ++i) {
            htmlToSend += `<tr style="border-bottom:0px solid #000"><td>${i+1}<td>${utilityFunctions.formattedDate(unique_date[i])}`;
            if(utilityFunctions.isEmptyObject(DUI_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset #00f">`;
            else htmlToSend += `<td>${DUI_ans[i].make}<td>${DUI_ans[i].comment}<td style="border-right:thick outset #00f">${DUI_ans[i].lifeTime}`;
            if(utilityFunctions.isEmptyObject(DUO_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset red">`;
            else htmlToSend += `<td>${DUO_ans[i].make}<td>${DUO_ans[i].comment}<td style="border-right:thick outset red">${DUO_ans[i].lifeTime}`;

            if(utilityFunctions.isEmptyObject(DDI_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset #00f">`;
            else htmlToSend += `<td>${DDI_ans[i].make}<td>${DDI_ans[i].comment}<td style="border-right:thick outset #00f">${DDI_ans[i].lifeTime}`;
            if(utilityFunctions.isEmptyObject(DDO_ans[i])) htmlToSend += `<td><td><td>`;
            else htmlToSend += `<td>${DDO_ans[i].make}<td>${DDO_ans[i].comment}<td>${DDO_ans[i].lifeTime}`;

            htmlToSend += `<td class=emptyInMiddle>`;

            if(utilityFunctions.isEmptyObject(GUI_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset #00f">`;
            else htmlToSend += `<td>${GUI_ans[i].make}<td>${GUI_ans[i].comment}<td style="border-right:thick outset #00f">${GUI_ans[i].lifeTime}`;
            if(utilityFunctions.isEmptyObject(GUO_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset red">`;
            else htmlToSend += `<td>${GUO_ans[i].make}<td>${GUO_ans[i].comment}<td style="border-right:thick outset red">${GUO_ans[i].lifeTime}`;

            if(utilityFunctions.isEmptyObject(GDI_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset #00f">`;
            else htmlToSend += `<td>${GDI_ans[i].make}<td>${GDI_ans[i].comment}<td style="border-right:thick outset #00f">${GDI_ans[i].lifeTime}`;
            if(utilityFunctions.isEmptyObject(GDO_ans[i])) htmlToSend += `<td><td><td>`;
            else htmlToSend += `<td>${GDO_ans[i].make}<td>${GDO_ans[i].comment}<td>${GDO_ans[i].lifeTime}`;

            htmlToSend += "</tr>";
            }
            htmlToSend += "</table></div>";
            doc_response.message = htmlToSend;
            res.render('workrollSection/view_machine_bearing' , doc_response);
          }
      });
    }
});

function makeTableBearing(uniqueDate, uniqueDateLen, typeArray) {
  var ans = [],
      counter = 0,
      prev_date = new Date(0),
      check_initial_date = prev_date,
      type_array_len = typeArray.length;

  if(type_array_len == 0)
    return Array(uniqueDateLen).fill({});

  for (var i = 0; i < uniqueDateLen; ++i) {

    if(counter < type_array_len && (uniqueDate[i]).getTime() === ((typeArray[counter]).date).getTime()) {
      if(prev_date === check_initial_date) {
        ans.push({
          make: (typeArray[counter]).make,
          comment: (typeArray[counter]).comment,
          lifeTime: ""
        });
      }
      else {
        ans.push({
          make: (typeArray[counter]).make,
          comment: (typeArray[counter]).comment,
          lifeTime: utilityFunctions.monthDiff(uniqueDate[i], prev_date)
        });
      }
      prev_date = uniqueDate[i];
      counter++;
    }
    else {
      ans.push({});
    }
  }
  return ans;
}
/* ************************************************************ */
/* Bearing Section Ends  */


/* ************************************************************ */
/* Back Up Roll Ends  */

//middlewares to add  machine back up roll entry
router.get('/addMachineBackUpRollEntry', function (req, res, next) {
      if(!req.query.type)
        res.redirect('/workrollSection');
      else
        res.render('workrollSection/add_back_up_roll_entry' , {
          type: req.query.type,
          machine: '',
          date: '',
          dia: '',
          comment: '',
          message: ''
      });
});

router.post('/addMachineBackUpRollEntry', function(req, res, next) {
  if(!req.body.date || !req.body.type ||  !req.body.dia || !req.body.m_no || !req.body.comment)
    res.redirect('/workrollSection');
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
      db.workroll.find ({
        $and : [ { m_no: req.body.m_no },
                {
                  roll: { $elemMatch: { type : req.body.type, date: date } }
                }]
      }).projection({m_no : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('workrollSection/add_back_up_roll_entry' , doc_response);
        } else if(docs.length > 0) {
            doc_response.message = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>Machine :- "${req.body.m_no}" Back Up Roll ${req.body.type} Already Exists on This date</div>`;
            res.render('workrollSection/add_back_up_roll_entry' , doc_response);
        } else {
            db.workroll.update({
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
                          res.render('workrollSection/add_back_up_roll_entry' , doc_response);
                      } else {
                          doc_response.message = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>SUCCESS!</strong> Added Entry Sucessfully</div>`;
                          res.render('workrollSection/add_back_up_roll_entry' , doc_response);
                        }
                  });
              }
          });
      }
});


//middleware to view a machine details
router.get('/viewMachineBackUpRoll', function(req, res, next) {
  res.render('workrollSection/view_machine_back_up_roll' , {
        machine : "",
        startingDate : "",
        endingDate : "",
        message : "",
        error: ""
  });
});

router.post('/viewMachineBackUpRoll', function(req, res, next) {
  if(!req.body.startingDate || !req.body.endingDate || !req.body.m_no)
    res.redirect('/workrollSection');
  else {
  var starting_date = (new Date(req.body.startingDate)).getTime(),
      ending_date = (new Date(req.body.endingDate)).getTime(),
      m_no = req.body.m_no,
      doc_response = {};

      doc_response.machine = m_no;
      doc_response.startingDate = req.body.startingDate;
      doc_response.endingDate = req.body.endingDate;
      doc_response.error = "";
      doc_response.message = "";

  db.workroll.find ({
      $and : [ {
                  m_no: req.body.m_no
               },
              {
                "roll.date": { $gte: new Date(req.body.startingDate) }
              },
              {
                "roll.date": { $lte: new Date(req.body.endingDate) }
              }
             ]
      }).projection({roll : 1}).exec(function(err, docs) {
        if(err) {
            doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
            res.render('workrollSection/view_machine_back_up_roll' , doc_response);
        } else if(docs.length > 1) {  // multiple documents found
              doc_response.error = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Multiple Machines With The Same Name Found!</strong></div>`;
              res.render('workrollSection/view_machine_back_up_roll' , doc_response);
        } else if(docs.length === 0 || docs[0].roll.length === 0 || starting_date > ending_date) {  // no documents found
              doc_response.error = `<div class="alert alert-dismissable alert-warning fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>No Entry Found In The Given Time Frame!</strong></div>`;
              res.render('workrollSection/view_machine_back_up_roll' , doc_response);
        } else {
            docs[0].roll.sort(function(a, b){
              let diff = a.date.getTime() - b.date.getTime();
              if(diff != 0)
                return diff;
              else
                return ((a.type > b.type)? 1:-1);
              });
            var len = docs[0].roll.length,
                i = 0,
                htmlToSend = `<div class="table container-fluid"><table class="table table-bordered table-condensed table-striped"><tr><th>S No.<th>Date<th colspan=2>Back Up Roll 1<th class=emptyInMiddle><th colspan=2>Back Up Roll 2<tr style="border-bottom: thick solid black;"><th><th><th>Diameter<th>Comment<th class=emptyInMiddle><th>Diameter<th>Comment</tr>`;

            // filling the table
            let counter = 1;
            for (i = 0; i < len; ++i) {
                let curr_date = docs[0].roll[i].date.getTime();
                if(curr_date < starting_date || curr_date > ending_date)
                  continue;

                htmlToSend += `<tr><td>${counter++}</td><td>${utilityFunctions.formattedDate(docs[0].roll[i].date)}</td>`;

                if(docs[0].roll[i].type === "1") {
                  htmlToSend += `<td>${docs[0].roll[i].dia}</td><td>${docs[0].roll[i].comment}</td>`;
                  htmlToSend += `<td class=emptyInMiddle></td>`;
                  if(i<len-1 && docs[0].roll[i+1].date.getTime() === docs[0].roll[i].date.getTime() && docs[0].roll[i+1].type === "2") {
                      htmlToSend += `<td>${docs[0].roll[i+1].dia}</td><td>${docs[0].roll[i+1].comment}</td>`;
                      ++i;
                  } else
                      htmlToSend += `<td></td><td></td>`;
                  } else {
                      htmlToSend += `<td></td><td></td>`;
                      htmlToSend += `<td class=emptyInMiddle></td>`;
                      htmlToSend += `<td>${docs[0].roll[i].dia}</td><td>${docs[0].roll[i].comment}</td>`;
                }
                htmlToSend += `</tr>`;
            }
            htmlToSend += `</table></div>`;
            doc_response.message = htmlToSend;
            res.render('workrollSection/view_machine_back_up_roll' , doc_response);
          }
      });
    }
});
module.exports = router;
