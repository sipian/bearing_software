const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      url = require('url'),
      utilityFunctions = require('./functions.js'),
      router = express.Router();

var db = require('./db.js');

router.get('/', function (req, res, next) {
    res.render('machineSection/index');
});

//middlewares to add new machine
router.get('/addNewMachine', function (req, res, next) {
    res.render('machineSection/add_new_machine' , {
        machine: '',
        message: '',
    });
});

router.post('/addNewMachine', function (req, res, next) {
    db.machine.insert({
        m_no: req.body.m_no,
        bearing: [],
        roll: []
    }, function (err, newDoc) {
        if (err) {
          res.render('machineSection/add_new_machine' , {
            'machine': req.body.m_no,
              'message': `<div class='alert alert-danger alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>ERROR!</strong> ${err.message}</div>`,
          });
        } else {
          res.render('machineSection/add_new_machine' , {
            'machine': req.body.m_no,
            'message': `<div class='alert alert-success alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>SUCCESS!</strong> Added Entry Sucessfully</div>`,
          });
        }
    });
});

//middlewares to add  machine bearing entry
router.get('/addMachineBearingEntry', function (req, res, next) {
      res.render('machineSection/add_machine_entry' , {
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
  var date = new Date(req.body.date);
  var doc_response = {
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
            doc_response.message = `<div class='alert alert-danger alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>ERROR! </strong> ${err.message}</div>`;
            res.render('machineSection/add_machine_entry' , doc_response);
        } else if(docs.length > 0) {
            doc_response.message = `<div class='alert alert-danger alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>ERROR! </strong>Machine :- "${req.body.m_no}" : "${utilityFunctions.getMachineTypeName(req.body.type)} > Bearing" Already Exists on This date </div>`;
            res.render('machineSection/add_machine_entry' , doc_response);
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
                          doc_response.message = `<div class='alert alert-danger alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>ERROR! </strong> ${(err)?(err.message):('The Machine Does Not Exist')}</div>`;
                          res.render('machineSection/add_machine_entry' , doc_response);
                      } else {
                          doc_response.message = `<div class='alert alert-success alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>SUCCESS!</strong> Added Entry Sucessfully</div>`;
                          res.render('machineSection/add_machine_entry' , doc_response);
                        }
                  });
              }
          });
});

//middleware to view a machine details
router.get('/viewMachineBearing', function(req, res, next) {
  res.render('machineSection/view_machine_bearing' , {
        machine : "",
        startingDate : "",
        endingDate : "",
        message : "",
        error: ""
  });
});

router.post('/viewMachineBearing', function(req, res, next) {
  var starting_date = (new Date(req.body.startingDate)).getTime(),
      ending_date = (new Date(req.body.endingDate)).getTime(),
      m_no = req.body.m_no,
      doc_response = {};

  doc_response.machine = m_no;
  doc_response.startingDate = req.body.startingDate;
  doc_response.endingDate = req.body.endingDate;
  doc_response.error = "";
  doc_response.message = "";

  db.machine.find ({
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
            doc_response.error = `<div class='alert alert-danger alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>ERROR! </strong> ${err.message}</div>`;
            res.render('machineSection/view_machine_bearing' , doc_response);
        } else if(docs.length > 1) {  // multiple documents found
              doc_response.error = `<div class='alert alert-success alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a> <strong>Multiple Machines With The Same Name Found!</strong></div>`;
              res.render('machineSection/view_machine_bearing' , doc_response);
        } else if(docs.length === 0 || docs[0].bearing.length === 0 || starting_date>ending_date) {  // no documents found
              doc_response.error = `<div class='alert alert-warning alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a> <strong>No Entry Found In The Given Time Frame!</strong></div>`;
              res.render('machineSection/view_machine_bearing' , doc_response);
        } else {
            docs[0].bearing.sort(function(a, b){
              return a.date - b.date;
              });
            // arrays to hold unique entru for each bearing sorted by date
            var DDO = [], DDI = [] ,
                DUO = [], DUI = [] ,
                GDO = [], GDI = [] ,
                GUO = [], GUI = [] ,
                uniquedate = [],  // array to store the dates sorted by date
                len = docs[0].bearing.length,
                uniquedateLen = 0,
                i = 0;

            // filling the arrays
            for (i = 0; i < len; ++i) {
                uniquedateLen = uniquedate.length;
                let currDate = (docs[0].bearing[i].date).getTime();
                if(currDate < starting_date || currDate > ending_date)
                  continue;

                if(docs[0].bearing[i].type === "ddo")
                  DDO.push(docs[0].bearing[i]);
                else if(docs[0].bearing[i].type === "ddi")
                  DDI.push(docs[0].bearing[i]);
                else if(docs[0].bearing[i].type === "duo")
                  DUO.push(docs[0].bearing[i]);
                else if(docs[0].bearing[i].type === "dui")
                  DUI.push(docs[0].bearing[i]);
                else if(docs[0].bearing[i].type === "gdo")
                  GDO.push(docs[0].bearing[i]);
                else if(docs[0].bearing[i].type === "gdi")
                  GDI.push(docs[0].bearing[i]);
                else if(docs[0].bearing[i].type === "guo")
                  GUO.push(docs[0].bearing[i]);
                else if(docs[0].bearing[i].type === "gui")
                  GUI.push(docs[0].bearing[i]);

                if(uniquedateLen === 0) {
                  uniquedate.push(docs[0].bearing[i].date);
                } else if(currDate !== (uniquedate[uniquedateLen-1]).getTime())  //checking for duplicacity
                    uniquedate.push(docs[0].bearing[i].date);
            }
            uniquedateLen = uniquedate.length;

          var htmlToSend = `<div class="table container"><table class="table table-bordered table-condensed table-striped"><tr><th>S No.<th>Date<th colspan=6 scope=col  style="border-right: thick outset red;">Dab Side Up<th colspan=6 scope=col>Dab Side Down<th class=emptyInMiddle><th colspan=6 scope=col style="border-right: thick outset red;">Gear Side Up<th colspan=6 scope=col>Gear Side Down<tr><th><th><th colspan=3 scope=col style="border-right: thick outset blue;">IN<th colspan=3 scope=col style="border-right: thick outset red;">OUT<th colspan=3 scope=col style="border-right: thick outset blue;">IN<th colspan=3 scope=col>OUT<th class=emptyInMiddle><th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3 style="border-right: thick outset red;">OUT<th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3>OUT<tr><th><th><th>make<th>cmt<th style="border-right: thick outset blue;">diff<th>make<th>cmt<th style="border-right: thick outset red;">diff<th>make<th>cmt<th style="border-right: thick outset blue;">diff<th>make<th>cmt<th>diff<th class=emptyInMiddle><th>make<th>cmt<th  style="border-right: thick outset blue;">diff<th>make<th>cmt<th  style="border-right: thick outset red;">diff<th>make<th>cmt<th  style="border-right: thick outset blue;">diff<th>make<th>cmt<th>diff`;

          var DDO_ans = makeTableBearing(uniquedate, uniquedateLen, DDO);
          var DDI_ans = makeTableBearing(uniquedate, uniquedateLen, DDI);
          var DUO_ans = makeTableBearing(uniquedate, uniquedateLen, DUO);
          var DUI_ans = makeTableBearing(uniquedate, uniquedateLen, DUI);

          var GDO_ans = makeTableBearing(uniquedate, uniquedateLen, GDO);
          var GDI_ans = makeTableBearing(uniquedate, uniquedateLen, GDI);
          var GUO_ans = makeTableBearing(uniquedate, uniquedateLen, GUO);
          var GUI_ans = makeTableBearing(uniquedate, uniquedateLen, GUI);

          for (i = 0; i < uniquedateLen; ++i) {
            htmlToSend += `<tr style="border-bottom: 1.5px solid black;">
                              <td>${i+1}</td>
                              <td>${utilityFunctions.formattedDate(uniquedate[i])}</td>
                          `;
            if(utilityFunctions.isEmptyObject(DUI_ans[i])) htmlToSend += `<td></td><td></td><td style="border-right: thick outset blue;"></td>`;
            else htmlToSend += `<td>${DUI_ans[i].make}</td><td>${DUI_ans[i].comment}</td><td style="border-right: thick outset blue;">${DUI_ans[i].lifeTime}</td>`;
            if(utilityFunctions.isEmptyObject(DUO_ans[i])) htmlToSend += `<td></td><td></td><td style="border-right: thick outset red;"></td>`;
            else htmlToSend += `<td>${DUO_ans[i].make}</td><td>${DUO_ans[i].comment}</td><td style="border-right: thick outset red;">${DUO_ans[i].lifeTime}</td>`;

            if(utilityFunctions.isEmptyObject(DDI_ans[i])) htmlToSend += `<td></td><td></td><td style="border-right: thick outset blue;"></td>`;
            else htmlToSend += `<td>${DDI_ans[i].make}</td><td>${DDI_ans[i].comment}</td><td style="border-right: thick outset blue;">${DDI_ans[i].lifeTime}</td>`;
            if(utilityFunctions.isEmptyObject(DDO_ans[i])) htmlToSend += `<td></td><td></td><td></td>`;
            else htmlToSend += `<td>${DDO_ans[i].make}</td><td>${DDO_ans[i].comment}</td><td>${DDO_ans[i].lifeTime}</td>`;

            htmlToSend += `<td  class="emptyInMiddle"></td>`;

            if(utilityFunctions.isEmptyObject(GUI_ans[i])) htmlToSend += `<td></td><td></td><td style="border-right: thick outset blue;"></td>`;
            else htmlToSend += `<td>${GUI_ans[i].make}</td><td>${GUI_ans[i].comment}</td><td style="border-right: thick outset blue;">${GUI_ans[i].lifeTime}</td>`;
            if(utilityFunctions.isEmptyObject(GUO_ans[i])) htmlToSend += `<td></td><td></td><td style="border-right: thick outset red;"></td>`;
            else htmlToSend += `<td>${GUO_ans[i].make}</td><td>${GUO_ans[i].comment}</td><td style="border-right: thick outset red;">${GUO_ans[i].lifeTime}</td>`;

            if(utilityFunctions.isEmptyObject(GDI_ans[i])) htmlToSend += `<td></td><td></td><td style="border-right: thick outset blue;"></td>`;
            else htmlToSend += `<td>${GDI_ans[i].make}</td><td>${GDI_ans[i].comment}</td><td style="border-right: thick outset blue;">${GDI_ans[i].lifeTime}</td>`;
            if(utilityFunctions.isEmptyObject(GDO_ans[i])) htmlToSend += `<td></td><td></td><td></td>`;
            else htmlToSend += `<td>${GDO_ans[i].make}</td><td>${GDO_ans[i].comment}</td><td>${GDO_ans[i].lifeTime}</td>`;

            htmlToSend += `</tr>`;
            }
            doc_response.message = htmlToSend;
            res.render('machineSection/view_machine_bearing' , doc_response);
          }
      });
});

function makeTableBearing(uniquedate, uniquedateLen, typeArray) {
  console.log("uniquedate : ", uniquedate);
  console.log("uniquedateLen : ", uniquedateLen);
  console.log("typeArray : ", typeArray);

  var ans = [],
      counter = 0,
      prevDate = new Date(0),
      checkInitialDate = prevDate,
      typeArrayLen = typeArray.length;

  if(typeArrayLen == 0)
    return Array(uniquedateLen).fill({});
  console.log("typeArrayLen : ", typeArrayLen);
  for (var i = 0; i < uniquedateLen; ++i) {
    console.log("ans : ", ans);
    console.log("counter : ", counter);
    console.log("i : ", i);

    if(counter<typeArrayLen && (uniquedate[i]).getTime() === ((typeArray[counter]).date).getTime()) {
      if(prevDate === checkInitialDate) {
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
          lifeTime: utilityFunctions.monthDiff(uniquedate[i], prevDate)
        });
      }
      prevDate = uniquedate[i];
      counter++;
    }
    else {
      ans.push({
        make: "",
        comment: "",
        lifeTime: ""
      });
    }
  }
  console.log("ans : ", ans);

  return ans;
}

module.exports = router;
