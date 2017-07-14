const express = require('express'),
      router = express.Router();

var db = require("./db.js");
//  function to add new item to data bodyParser
router.post('/addToDatabase', function (req, res, next) {
    //log.info("post request for addToDatabase");

    let dateOfEntry = decodeURIComponent(req.body.date.trim());
    let itemName = decodeURIComponent(req.body.names.trim());
    let unit = decodeURIComponent(req.body.unit.trim());
    let group = decodeURIComponent(req.body.group.trim());
    let make = decodeURIComponent(req.body.make.trim());
    let bill = decodeURIComponent(req.body.bill.trim());
    let openingBalance = parseFloat(decodeURIComponent(req.body.openingBalance.trim()));
    let doc = {
        date: [dateOfEntry],
        name: itemName.trim(),
        unit: unit,
        group: group,
        bill: [bill],
        items_added_to_Stock: [openingBalance],
        whom_to_issue: [null],
        purpose_of_issue: [null],
        items_given_to_staff: [0],
        make: [make],
        openingBalance: openingBalance,
        balance: openingBalance
    };
    db.insert(doc, function (err, newDoc) {  
        if (err) {
            //log.info("Error in /addToDatabase : " + err);
            res.send("error");
        } else {
            //log.info(newDoc);
            res.send("success");
        }
    });
});
router.post('/IssueItemToStaffDatabase', function (req, res, next) {
    //  //log.info("post request for IssueItemToStaffDatabase");
    req.body.date = decodeURIComponent(req.body.date);
    req.body.names = decodeURIComponent(req.body.names);
    req.body.issue = decodeURIComponent(req.body.issue);
    req.body.whom = decodeURIComponent(req.body.whom);
    req.body.purpose = decodeURIComponent(req.body.purpose);
    
    let dateOfEntry = req.body.date.trim();
    let itemName = req.body.names.trim();
    let qtyGiven = parseFloat(req.body.issue.trim());
    let whomToIssue = req.body.whom.trim();
    let purposeOfIssue = req.body.purpose.trim();
    db.find({
        name: itemName
    }, function (err, docs) {
        if (err) {
            //log.info("Error happened while /viewBalanceOf1Item : " + err);
            res.send("errorDB find error");
        } else {
            if (docs.length == 1) {
                if (qtyGiven <= parseFloat(docs[0].balance)) {
                    db.update({
                        name: itemName
                    }, {
                        $push: {
                            date: dateOfEntry,
                            items_added_to_Stock: 0,
                            bill: null,
                            whom_to_issue: whomToIssue,
                            purpose_of_issue: purposeOfIssue,
                            items_given_to_staff: qtyGiven,
                            make: null
                        },
                        $inc: {
                            balance: (-1) * qtyGiven
                        }
                    }, {
                        upsert: false
                    }, function (err, numAffected, affectedDocuments, upsert) {
                        if (err) {
                            //log.info("/IssueItemToStaffDatabase : " + err);
                            res.send("errorDB update error");
                        } else {
                            //log.info("success in /IssueItemToStaffDatabase : " + numAffected);
                            res.send("success");
                        }
                    });
                } else res.send("errorThere are not enough items <br>to issue the given items.");
            } else res.send("errorMultiple Entries Of The Same Name.");
        }
    });
});
router.post('/RecieveItemFromSupplierToStore', function (req, res, next) {
    //log.info("post request for RecieveItemFromSupplierToStore");
    req.body.date = decodeURIComponent(req.body.date);
    req.body.names = decodeURIComponent(req.body.names);
    req.body.bill = decodeURIComponent(req.body.bill);
    req.body.recieve = decodeURIComponent(req.body.recieve);
    req.body.make = decodeURIComponent(req.body.make);
    
    let dateOfEntry = req.body.date.trim();
    let itemName = req.body.names.trim();
    let bill = req.body.bill.trim();
    let Balance = parseFloat(req.body.recieve.trim());
    let make = req.body.make.trim();
    db.update({
        name: itemName
    }, {
        $push: {
            date: dateOfEntry,
            items_added_to_Stock: Balance,
            bill: bill,
            whom_to_issue: null,
            purpose_of_issue: null,
            items_given_to_staff: 0,
            make: make
        },
        $inc: {
            balance: Balance
        }
    }, {
        upsert: false
    }, function (err, numAffected, affectedDocuments, upsert) {
        if (err) {
            //log.info("Error in /RecieveItemFromSupplierToStore : " + err);
            res.send("error");
        } else {
            //log.info("success in /RecieveItemFromSupplierToStore : " + numAffected);
            res.send("success");
        }
    });
});

module.exports = router;
