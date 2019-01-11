const utilityFunctions = require('./functions.js'),
      db = require('./db.js');

module.exports = {
    /*
        purpose values:
            update
            delete
            updateexisting
            deleteexisting
     */
 commonUpdateDeleteChecking: function(req, res, purpose) {
    var doc_response = {
          heading : (req.body.type === "roll")?"Work Roll" : "Machine",
          type : req.body.type,
          purpose:(purpose==="update")?`Update Name Of ${((req.body.type === "roll")?"Work Roll" : "Machine")}`:
                  (purpose==="delete")?`Delete ${((req.body.type === "roll")?"Work Roll" : "Machine")}`:
                  (purpose==="updateexisting")?`Update Existing Entry Of ${((req.body.type === "roll")?"Work Roll" : "Machine")}`:
                                               `Delete Existing Entry Of ${((req.body.type === "roll")?"Work Roll" : "Machine")}`,
          purposeKeyword: purpose,
          name : req.body.name,
          error : "",
          message : ""
        };
    if(req.body.type === "m_no") {
        db.machine.find ({
            m_no: req.body.name
        }).projection({bearing : 1, roll : 1}).exec(function(err, docs) {
              if(err) {
                  doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
                  res.render('updateEntry/update_name', doc_response);
              } else if(docs.length > 1) {  // multiple documents found
                    doc_response.error = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Multiple Machines With The Same Name Found!</strong></div>`;
                    res.render('updateEntry/update_name', doc_response);
              } else if(docs.length === 0) {  // no documents found
                    doc_response.error = `<div class="alert alert-dismissable alert-warning fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Machine Not Found!</strong></div>`;
                    res.render('updateEntry/update_name', doc_response);
              } else {
                    var htmlTosend = `<div class="well well-sm" style="text-align:center;">${req.body.name} Bearing Details</div>`;

                    htmlTosend += (purpose==="update"||purpose==="delete")?utilityFunctions.machineBearingMakeTable(docs[0].bearing):utilityFunctions.updateMachineBearingMakeTable(docs[0].bearing, new Date("2000-01-02"), new Date("9999-01-02"), req.body.name, purpose);
                    htmlTosend += `<br><br><br><div class="well well-sm" style="text-align:center;">${req.body.name} Back Up Roll Details</div>`;
                    htmlTosend += (purpose==="update"||purpose==="delete")?utilityFunctions.machineBackUpRollMakeTable(docs[0].roll):utilityFunctions.machineBackUpRollMakeTable(docs[0].roll, new Date("2000-01-02"), new Date("9999-01-02"), req.body.name, purpose);

                    htmlTosend += (purpose==="update"||purpose==="delete")?`<br><br>
                    <p style="text-align:center;">
                      <a name="${(purpose==="update")?"updateNameAnchorClickSelector":"deleteNameAnchorClickSelector"}" href="/updateEntry/${(purpose==="update")?"updateIndividualName":"deleteIndividualName"}?name=${encodeURIComponent(req.body.name)}&type=${encodeURIComponent(req.body.type)}" class="btn btn-white btn-info">
                        <span class="glyphicon glyphicon-pencil"></span> ${(purpose==="update")?"Update":"Delete"} Machine's Name
                      </a>
                    </p>
                    <br><br><br><br>`:`<br><br><br><br><br><br>`;
                    doc_response.message = htmlTosend;
                    res.render('updateEntry/update_name', doc_response);
                }
            });
        } else if(req.body.type === "roll") {
            db.workroll.find ({
                roll: req.body.name
            }).projection({field : 1, status : 1}).exec(function(err, docs) {
                  if(err) {
                      doc_response.error = `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>${err.message}</div>`;
                      res.render('updateEntry/update_name', doc_response);
                  } else if(docs.length > 1) {  // multiple documents found
                        doc_response.error = `<div class="alert alert-dismissable alert-success fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Multiple Work Rolls With The Same Name Found!</strong></div>`;
                        res.render('updateEntry/update_name', doc_response);
                  } else if(docs.length === 0) {  // no documents found
                        doc_response.error = `<div class="alert alert-dismissable alert-warning fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>Work Roll Not Found!</strong></div>`;
                        res.render('updateEntry/update_name', doc_response);
                  } else {
                        var htmlTosend = `<div class="well well-sm" style="text-align:center;">${req.body.name} Transaction Details</div>`;

                        htmlTosend += (purpose==="update"||purpose==="delete")?utilityFunctions.machineWorkRollMakeTable(docs[0].field, docs[0].status):utilityFunctions.machineWorkRollMakeTable(docs[0].field, docs[0].status, new Date("2000-01-02"), new Date("9999-01-02"), req.body.name, purpose);
                        htmlTosend += (purpose==="update"||purpose==="delete")?`<br><br>
                        <p style="text-align:center;">
                          <a href="/updateEntry/${(purpose==="update")?"updateIndividualName":"deleteIndividualName"}?name=${encodeURIComponent(req.body.name)}&type=${encodeURIComponent(req.body.type)}" class="btn btn-white btn-info">
                            <span class="glyphicon glyphicon-pencil"></span> ${(purpose==="update")?"Update":"Delete"} Work Roll's Name
                            </a>
                        </p>
                        <br><br><br><br>`:`<br><br><br><br><br><br>`;
                        doc_response.message = htmlTosend;
                        res.render('updateEntry/update_name', doc_response);
                    }
                });
            } else
                res.redirect('/updateEntry/home');
      }
};
