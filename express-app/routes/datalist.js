const express = require('express'),
      router = express.Router();

var db = require("./db.js");

// get autocomplete array containing all the machine names
router.get('/machine_no', function(req, res, next) {
    db.machine.find({

    }).projection({ m_no: 1 }).exec(function(err, docs) {
        if (err) {
            console.log("Datalist For machine_no Error " + err);
            res.send("error");
        } else {
            var datalistData = [],
                len = docs.length;

            for (var i = 0; i < len; ++i) {
                datalistData.push(docs[i].m_no);
            }
            res.send(datalistData);
        }
    });
});

// get autocomplete array containing all the machine make
router.get('/make', function(req, res, next) {
    db.machine.find({

    }).projection({ "bearing.make": 1 }).exec(function(err, docs) {
        if (err) {
            console.log("Datalist For make Error " + err);
            res.send("error");
        } else {
            var datalistData = [],
                len = docs.length;

            for (var i = 0; i < len; ++i) {
                datalistData.push(docs[i].bearing.make);
            }
            res.send(datalistData);
        }
    });
});

// check if a machine with a name exists
router.get('/checkIfMachineExists', function (req, res, next) {
    db.machine.find({
        m_no: req.query.data
    }).projection({ m_no: 1 }).exec(function (err, docs) {
        if (err) {
            console.log("Error happened while /checkIfMachineExists : " + err);
            res.send("error");
        } else {
            if (docs.length > 1) {
                res.send("multiple");
            } else if (docs.length === 1) {
                res.send("exists");
            } else {
                res.send("doesNotexist");
            }
        }
    });
});

// check if a work roll with a name exists
router.get('/checkIfWorkRollExists', function (req, res, next) {
  db.workroll.find({
      roll_no: req.query.data
  }).projection({ roll_no: 1 }).exec(function (err, docs) {
      if (err) {
          console.log("Error happened while /checkIfWorkRollExists : " + err);
          res.send("error");
      } else {
          if (docs.length > 1) {
              res.send("multiple");
          } else if (docs.length === 1) {
              res.send("exists");
          } else {
              res.send("doesNotexist");
          }
      }
  });
});

module.exports = router;
