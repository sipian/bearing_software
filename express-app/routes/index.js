const express = require('express')
    , path = require('path')
    , fs = require('fs')
    , utilityFunctions = require('./functions.js')
    , router = express.Router();
var db = require("./db.js");
router.get('/', function (req, res, next) {
    //log.info("get request home page");
    res.render('index');
});
router.get('/datalistForGroup', function (req, res, next) {
    db.find({}, function (err, docs) {
        if (err) {
            //log.info("Datalist For Group Error");
            res.send("error");
        } else {

            let datalistData = "";

            for (let i = 0; i < docs.length; i++) {
                if (datalistData.indexOf(docs[i].group) == -1) {
                    datalistData = datalistData + docs[i].group + "!@#$%^&*";
                }
            }
            datalistData = datalistData.slice(0, -8);
            //log.info("Datalist For Group Success");
            res.send(datalistData);
        }
    })
})
router.get('/add_new_item', function (req, res, next) {
    res.render('add_new_item');
});
router.get('/issue_present_item', function (req, res, next) {
    //log.info("get request for issue_present_item");
    res.render('issue_present_item');
});
router.get('/receive_present_item', function (req, res, next) {
    //log.info("get request for receive_present_item");
    res.render('receive_present_item');
});
router.get('/view_item_details', function (req, res, next) {
    //log.info("get request for view_item_details");
    res.render('view_item_details');
});
router.get('/reports', function (req, res, next) {
    //log.info("get request for reports");
    res.render('reports');
});
router.get('/edit_entry', function (req, res, next) {
    //log.info("get request for edit_entry");
    res.render('edit_entry', {
        incorrect: " "
    });
});
router.get('/edit_entry_success', function (req, res, next) {
    //log.info("get request for edit_entry_success");
    res.render('edit_entry_success');
});
router.get('/edit_entry_name', function (req, res, next) {
    //log.info("get request for edit_entry_name");
    res.render('edit_entry_success_name');
});
router.get('/edit_entry_entry', function (req, res, next) {
    //log.info("get request for edit_entry_entry");
    res.render('edit_entry_success_entry');
});
router.get('/delete_entry_one', function (req, res, next) {
    //log.info("get request for delete_entry_one");
    res.render('edit_entry_success_delete');
});
//  function to check if item exists with item name given begins
router.get('/checkIfEntryExists', function (req, res, next) {
    //log.info("get request for checkIfEntryExists");
    req.query.data = decodeURIComponent(req.query.data)
    db.find({
        name: req.query.data
    }, function (err, docs) {
        if (err) {
            //log.info("Error happened while /checkIfEntryExists : " + err);
            res.send("error");
        } else {
            if (docs.length > 0) {
                //log.info("existsAlready");
                res.send("existsAlready");
            } else {
                //log.info("doesNotexist");
                res.send("doesNotexist");
            }
        }
    });
});
//  function to check if item exists with item name given begins
router.get('/checkIfEntryExistsGroup', function (req, res, next) {
    //log.info("get request for checkIfEntryExistsGroup");
    req.query.data = decodeURIComponent(req.query.data);

    db.find({
        group: req.query.data
    }, function (err, docs) {
        if (err) {
            //log.info("Error happened while /checkIfEntryExists : " + err);
            res.send("error");
        } else {
            if (docs.length > 0) {
                //log.info("existsAlready");
                res.send("existsAlready");
            } else {
                //log.info("doesNotexist");
                res.send("doesNotexist");
            }
        }
    });
});
//  function to return unit and balance begins
router.get('/getUnitAndCurrentBalance', function (req, res, next) {
    //log.info("get request for getUnitAndCurrentBalance");
    req.query.data = decodeURIComponent(req.query.data)
    db.find({
        name: req.query.data
    }, function (err, docs) {
        if (err) {
            //log.info("Error happened while /getUnitAndCurrentBalance : " + err);
            res.send("error");
        } else {
            if (docs.length == 1) {
                let a = {
                    "unit": docs[0].unit
                    , "balance": docs[0].balance
                    , "group": docs[0].group
                };
                res.send(a);
            } else {
                res.send("error");
            }
        }
    });
});
router.get('/balanceZero', function (req, res, next) {
    //log.info("get request for balanceZero");
    db.find({
        balance: 0
    }).sort({name:1}).exec(function (err, docs) {
        if (err) {
            //log.info('error in balanceZero' + err);
            res.render('balanceZero', {
                table: "Some Error Occured While Fetching The Data."
            });
        } else if (docs.length > 0) {
            let htmlToSend = `
          <table class="table table-bordered table-condensed table-responsive">
              <tbody>`;
            for (let i = 0; i < docs.length; i++) {
                if (i % 7 == 0) htmlToSend += '<tr class="active">';
                htmlToSend += `<td class='col-md-2'>${docs[i].name}</td>`;
                if (i % 7 == 6) htmlToSend += '</tr>';
            }
            htmlToSend += `
          </tbody>
          </table>
          `;
            //log.info(htmlToSend);
            res.render('balanceZero', {
                table: htmlToSend
            });
        } else {
            //log.info(htmlToSend);
            res.render('balanceZero', {
                table: "<h4 style='color:red;'>No Items With Current Balance as Zero Found.</h4>"
            });
        }
    });
});
/* edit entry functions */
let oldPassword = '4beeca7fe97ca498a28d45b89cea3369bdf5fe5560a080d032c1b5ec8a6bd976';
router.post('/checkPassword', function (req, res, next) {
    let crypto = require('crypto');
    let password = 'aEwYjwXMq99br4aL8VWg';
    let hash = crypto.createHmac('sha256', password).update(req.body.password).digest('hex');
    //log.info(hash);
    if (hash === oldPassword) res.render('edit_entry_success');
    else res.render('edit_entry', {
        incorrect: "incorrect password"
    });
});
router.get('/editName', function (req, res, next) {
    req.query.name = decodeURIComponent(req.query.name);
    req.query.newName = decodeURIComponent(req.query.newName);
    
    let name = req.query.name.trim();
    let newName = req.query.newName.trim();
    db.update({
        name: name
    }, {
        $set: {
            name: newName
        }
    }, {
        multi: true
    }, function (err, numReplaced) {
        if (err) res.send("error");
        else res.send("success");
    });
});
router.get('/editGroup', function (req, res, next) {
    req.query.name = decodeURIComponent(req.query.name);
    req.query.newGroup = decodeURIComponent(req.query.newGroup);

    let name = req.query.name.trim();
    let newGroup = req.query.newGroup.trim();
    db.update({
        name: name
    }, {
        $set: {
            group: newGroup
        }
    }, {
        multi: true
    }, function (err, numReplaced) {
        if (err) res.send("error");
        else res.send("success");
    });
});
router.get('/editMake', function (req, res, next) {
    req.query.name = decodeURIComponent(req.query.name);
    req.query.newMake = decodeURIComponent(req.query.newMake);

    let name = req.query.name.trim();
    let newMake = req.query.newMake.trim();
    db.update({
        name: name
    }, {
        $set: {
            "make[0]": newMake
        }
    }, {
        multi: true
    }, function (err, numReplaced) {
        if (err) res.send("error");
        else res.send("success");
    });
});
router.get('/editUnit', function (req, res, next) {
    req.query.name = decodeURIComponent(req.query.name);
    req.query.newUnit = decodeURIComponent(req.query.newUnit);

    let name = req.query.name.trim();
    let newUnit = req.query.newUnit.trim();
    db.update({
        name: name
    }, {
        $set: {
            unit: newUnit
        }
    }, {
        multi: true
    }, function (err, numReplaced) {
        if (err) res.send("error");
        else res.send("success");
    });
});
var editIssuedEntryletiable = -1;
router.get('/getIssuedEntry1024', function (req, res, next) {
    //log.info("enter1");
    req.query.names = decodeURIComponent(req.query.names);
    req.query.issueEditDate = decodeURIComponent(req.query.issueEditDate);
    req.query.quantity = decodeURIComponent(req.query.quantity);
    req.query.whom = decodeURIComponent(req.query.whom);
    req.query.purpose = decodeURIComponent(req.query.purpose);

    let name = req.query.names.trim();
    let date = req.query.issueEditDate.trim();
    let Quantity = parseFloat(req.query.quantity.trim());
    let whom = req.query.whom.trim();
    let purpose = req.query.purpose.trim();
    db.find({
        name: name
    }, function (err, docs) {
        if (err) {
            //log.info('error in checking issued entry' + err);
            res.send('error');
        } else if (docs.length == 1) {
            let dataArray = [];
            let index = docs[0].date.indexOf(date);
            for (let i = 0; i < docs[0].date.length; i++) {
                if (index == -1) break;
                else {
                    dataArray.push(index);
                    index = docs[0].date.indexOf(date, index + 1);
                }
            }
            let flag = 1;
            for (let i = 0; i < dataArray.length; i++) {
                if (docs[0].date[dataArray[i]] == date && docs[0].whom_to_issue[dataArray[i]] == whom && docs[0].purpose_of_issue[dataArray[i]] == purpose && docs[0].items_given_to_staff[dataArray[i]] == Quantity) {
                    editIssuedEntryletiable = dataArray[i];
                    flag = 2;
                }
            }
            if (flag == 1) {
                editIssuedEntryletiable = -1;
                //log.info("not found.");
                res.send("not found");
            } else {
                //log.info("found");
                res.send("found");
            }
        }
    });
});
router.get('/editIssuedEntryQuantity', function (req, res, next) {
    req.query.names = decodeURIComponent(req.query.names);
    req.query.quantity = decodeURIComponent(req.query.quantity);

    let name = req.query.names.trim();
    let Quantity = parseFloat(req.query.quantity.trim());
    if (editIssuedEntryletiable == -1) res.send("incomplete");
    db.find({
        name: name
    }, function (err, docs) {
        if (err) res.send("error");
        else if (docs.length == 1) {
            let change = parseFloat(docs[0].items_given_to_staff[editIssuedEntryletiable]);
            docs[0].items_given_to_staff[editIssuedEntryletiable] = Quantity;
            if (parseFloat(docs[0].balance) + change - Quantity < 0) res.send("negative");
            else {
                db.update({
                    name: name
                }, {
                    $set: {
                        items_given_to_staff: docs[0].items_given_to_staff
                    , }
                    , $inc: {
                        balance: change - Quantity
                    }
                }, {
                    multi: true
                }, function (err, numReplaced) {
                    if (err) res.send("error");
                    else res.send("success");
                });
            }
        } else res.send("error");
    });
});
router.get('/editIssuedEntrywhom', function (req, res, next) {
    req.query.names = decodeURIComponent(req.query.names);
    req.query.whom = decodeURIComponent(req.query.whom);

    let name = req.query.names.trim();
    let whom = req.query.whom.trim();
    if (editIssuedEntryletiable == -1) res.send("incomplete");
    db.find({
        name: name
    }, function (err, docs) {
        if (err) res.send("error");
        else if (docs.length == 1) {
            docs[0].whom_to_issue[editIssuedEntryletiable] = whom;
            db.update({
                name: name
            }, {
                $set: {
                    whom_to_issue: docs[0].whom_to_issue
                , }
            , }, {
                multi: true
            }, function (err, numReplaced) {
                if (err) res.send("error");
                else res.send("success");
            });
        } else res.send("error");
    });
});
router.get('/editIssuedEntryPurpose', function (req, res, next) {
    req.query.names = decodeURIComponent(req.query.names);
    req.query.purpose = decodeURIComponent(req.query.purpose);
    let name = req.query.names.trim();
    let purpose = req.query.purpose.trim();
    if (editIssuedEntryletiable == -1) res.send("incomplete");
    db.find({
        name: name
    }, function (err, docs) {
        if (err) res.send("error");
        else if (docs.length == 1) {
            docs[0].purpose_of_issue[editIssuedEntryletiable] = purpose;
            db.update({
                name: name
            }, {
                $set: {
                    purpose_of_issue: docs[0].purpose_of_issue
                , }
            , }, {
                multi: true
            }, function (err, numReplaced) {
                if (err) res.send("error");
                else res.send("success");
            });
        } else res.send("error");
    });
});
router.get('/editIssuedEntryDate', function (req, res, next) {
    req.query.names = decodeURIComponent(req.query.names);
    req.query.date = decodeURIComponent(req.query.date);
    let name = req.query.names.trim();
    let date = req.query.date.trim();
    if (editIssuedEntryletiable == -1) res.send("incomplete");
    db.find({
        name: name
    }, function (err, docs) {
        if (err) res.send("error");
        else if (docs.length == 1) {
            docs[0].date[editIssuedEntryletiable] = date;
            db.update({
                name: name
            }, {
                $set: {
                    date: docs[0].date
                , }
            , }, {
                multi: true
            }, function (err, numReplaced) {
                if (err) res.send("error");
                else res.send("success");
            });
        } else res.send("error");
    });
});
/*********************************EDITING RECEIVED ITEM*********************************/
var editReceivedEntryletiable = -1;
router.get('/getReceivedEntry1024', function (req, res, next) {
    //log.info("enter1@");
    req.query.names = decodeURIComponent(req.query.names);
    req.query.receiveEditDate = decodeURIComponent(req.query.receiveEditDate);
    req.query.quantity = decodeURIComponent(req.query.quantity);
    req.query.make = decodeURIComponent(req.query.make);
    req.query.bill = decodeURIComponent(req.query.bill);
    let name = req.query.names.trim();
    let date = req.query.receiveEditDate.trim();
    let Quantity = parseFloat(req.query.quantity.trim());
    let make = req.query.make.trim();
    let bill = req.query.bill.trim();
    db.find({
        name: name
    }, function (err, docs) {
        if (err) {
            //log.info('error in checking received entry' + err);
            res.send('error');
        } else if (docs.length == 1) {
            let dataArray = [];
            let index = docs[0].date.indexOf(date);
            for (let i = 0; i < docs[0].date.length; i++) {
                if (index == -1) break;
                else {
                    dataArray.push(index);
                    index = docs[0].date.indexOf(date, index + 1);
                }
            }
            let flag = 1;
            for (let i = 0; i < dataArray.length; i++) {
                if (docs[0].date[dataArray[i]] == date && docs[0].make[dataArray[i]] == make && docs[0].bill[dataArray[i]] == bill && docs[0].items_added_to_Stock[dataArray[i]] == Quantity) {
                    editReceivedEntryletiable = dataArray[i];
                    flag = 2;
                }
            }
            if (flag == 1) {
                editReceivedEntryletiable = -1;
                //log.info("not found.");
                res.send("not found");
            } else {
                //log.info("found");
                res.send("found");
            }
        }
    });
});
router.get('/editReceivedEntryQuantity', function (req, res, next) {
    req.query.names = decodeURIComponent(req.query.names);
    req.query.quantity = decodeURIComponent(req.query.quantity);
    let name = req.query.names.trim();
    let Quantity = parseFloat(req.query.quantity.trim());
    if (editReceivedEntryletiable == -1) res.send("incomplete");
    db.find({
        name: name
    }, function (err, docs) {
        if (err) res.send("error");
        else if (docs.length == 1) {
            let change = parseFloat(docs[0].items_added_to_Stock[editReceivedEntryletiable]);
            docs[0].items_added_to_Stock[editReceivedEntryletiable] = Quantity;
            let data;
            if (editReceivedEntryletiable == 0) {
                data = {
                    items_added_to_Stock: docs[0].items_added_to_Stock
                    , openingBalance: Quantity
                }
            } else {
                data = {
                    items_added_to_Stock: docs[0].items_added_to_Stock
                , }
            }
            db.update({
                name: name
            }, {
                $set: data
                , $inc: {
                    balance: Quantity - change
                }
            }, {
                multi: true
            }, function (err, numReplaced) {
                if (err) res.send("error");
                else res.send("success");
            });
        } else res.send("error");
    });
});
router.get('/editReceivedEntryMake', function (req, res, next) {
    req.query.names = decodeURIComponent(req.query.names);
    req.query.make = decodeURIComponent(req.query.make);
    let name = req.query.names.trim();
    let make = req.query.make.trim();
    if (editReceivedEntryletiable == -1) res.send("incomplete");
    db.find({
        name: name
    }, function (err, docs) {
        if (err) res.send("error");
        else if (docs.length == 1) {
            docs[0].make[editReceivedEntryletiable] = make;
            db.update({
                name: name
            }, {
                $set: {
                    make: docs[0].make
                , }
            , }, {
                multi: true
            }, function (err, numReplaced) {
                if (err) res.send("error");
                else res.send("success");
            });
        } else res.send("error");
    });
});
router.get('/editReceivedEntryBill', function (req, res, next) {
    req.query.names = decodeURIComponent(req.query.names);
    req.query.bill = decodeURIComponent(req.query.bill);
    let name = req.query.names.trim();
    let bill = req.query.bill.trim();
    if (editReceivedEntryletiable == -1) res.send("incomplete");
    db.find({
        name: name
    }, function (err, docs) {
        if (err) res.send("error");
        else if (docs.length == 1) {
            docs[0].bill[editReceivedEntryletiable] = bill;
            db.update({
                name: name
            }, {
                $set: {
                    bill: docs[0].bill
                , }
            , }, {
                multi: true
            }, function (err, numReplaced) {
                if (err) res.send("error");
                else res.send("success");
            });
        } else res.send("error");
    });
});
router.get('/editReceivedEntryDate', function (req, res, next) {
    req.query.names = decodeURIComponent(req.query.names);
    req.query.date = decodeURIComponent(req.query.date);
    let name = req.query.names.trim();
    let date = req.query.date.trim();
    if (editReceivedEntryletiable == -1) res.send("incomplete");
    db.find({
        name: name
    }, function (err, docs) {
        if (err) res.send("error");
        else if (docs.length == 1) {
            docs[0].date[editReceivedEntryletiable] = date;
            db.update({
                name: name
            }, {
                $set: {
                    date: docs[0].date
                , }
            , }, {
                multi: true
            }, function (err, numReplaced) {
                if (err) res.send("error");
                else res.send("success");
            });
        } else res.send("error");
    });
});
router.get('/deleteEntry', function (req, res, next) {
    req.query.name = decodeURIComponent(req.query.name);
    db.remove({
        name: req.query.name
    }, {
        multi: false
    }, function (err, numRemoved) {
        if (err) res.send("error");
        else if (numRemoved == 1) res.send("success");
        else res.send("error");
    });
});
module.exports = router;