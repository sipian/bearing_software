const express = require('express'),
      router = express.Router();
var db = require("./db.js");

router.get('/name', function(req, res, next) {
    db.find({}, function(err, docs) {
        if (err) {
            //log.info("Datalist For Name Error");
            res.send("error");
        } else {
            //log.info("Datalist For Name Success");
            let datalistData = "";
            for (let i = 0; i < docs.length; i++) {
                datalistData = datalistData + docs[i].name + "!@#$%^&*";
            }
            datalistData = datalistData.slice(0, -8);
            res.send(datalistData);
        }
    })
})

router.get('/unit', function(req, res, next) {
    db.find({}, function(err, docs) {
        if (err) {
            //log.info("Datalist For Unit Error");
            res.send("error");
        } else {
            let datalistData = "";
            for (let i = 0; i < docs.length; i++) {
                if (datalistData.indexOf(docs[i].unit) == -1)
                    datalistData = datalistData + docs[i].unit + "!@#$%^&*";
            }
            datalistData = datalistData.slice(0, -8);
            //log.info("Datalist For Unit Success");
            res.send(datalistData);
        }
    })
})

router.get('/whomToIssue', function(req, res, next) {
    db.find({}, function(err, docs) {
        if (err) {
            //log.info("Datalist For Whom To Issue Error");
            res.send("error");
        } else {
            let datalistData = "";
            for (let i = 0; i < docs.length; i++) {
                let x;
                for (x in docs[i].whom_to_issue) {
                    if (docs[i].whom_to_issue[x] != null && datalistData.indexOf(docs[i].whom_to_issue[x]) == -1)
                        datalistData = datalistData + docs[i].whom_to_issue[x] + "!@#$%^&*";
                }
            }
            datalistData = datalistData.slice(0, -8);
            //log.info("Datalist For Whom To Issue Success");
            res.send(datalistData);
        }
    })
});


router.get('/purposeOfIssue', function(req, res, next) {
    db.find({}, function(err, docs) {
        if (err) {
            //log.info("Datalist For Purpose Of Issue Error");
            res.send("error");
        } else {
            let datalistData = "";
            for (let i = 0; i < docs.length; i++) {
                let x;
                for (x in docs[i].purpose_of_issue) {
                    if (docs[i].purpose_of_issue[x] != null && datalistData.indexOf(docs[i].purpose_of_issue[x]) == -1)
                        datalistData = datalistData + docs[i].purpose_of_issue[x] + "!@#$%^&*";
                }
            }
            datalistData = datalistData.slice(0, -8);
            //log.info("Datalist For purpose of issue Success");
            res.send(datalistData);
        }
    })
});

router.get('/make', function(req, res, next) {
    db.find({}, function(err, docs) {
        if (err) {
            //log.info("Datalist For Make Error");
            res.send("error");
        } else {
            let datalistData = "";
            for (let i = 0; i < docs.length; i++) {
                let x;
                for (x in docs[i].make) {
                    if (docs[i].make[x] && datalistData.indexOf(docs[i].make[x]) == -1)
                        datalistData = datalistData + docs[i].make[x] + "!@#$%^&*";
                }
            }
            datalistData = datalistData.slice(0, -8);
            //log.info("Datalist For Make Success");
            res.send(datalistData);
        }
    })
});

module.exports = router;
