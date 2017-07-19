const express = require('express'),
      router = express.Router(),
      db = require("./db.js");

/* ************************************ */
/* MACHINE'S DATALIST */

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


/* ************************************ */
/* WORK ROLL'S DATALIST */

// get autocomplete array containing all the new workroll names
router.get('/roll', function(req, res, next) {
    var jsonFind = {};
    if(req.query.status !== "both")
      jsonFind.status = req.query.status;
    db.workroll.find(jsonFind).projection({ roll: 1 }).exec(function(err, docs) {
        if (err) {
            console.log("Datalist For roll Error " + err);
            res.send("error");
        } else {
            var datalistData = [],
                len = docs.length;

            for (var i = 0; i < len; ++i) {
                datalistData.push(docs[i].roll);
            }
            res.send(datalistData);
        }
    });
});

// get autocomplete array containing all the workrolls reason
router.get('/reason', function(req, res, next) {
    db.workroll.find({

    }).projection({ "field.reason": 1 }).exec(function(err, docs) {
        if (err) {
            console.log("Datalist For reason Error " + err);
            res.send("error");
        } else {
            var datalistData = [],
                len = docs.length;

            for (var i = 0; i < len; ++i) {
                datalistData.push(docs[i].field.reason);
            }
            res.send(datalistData);
        }
    });
});

// get autocomplete array containing all the workrolls operator names
router.get('/operator', function(req, res, next) {
    db.workroll.find({

    }).projection({ "field.operator": 1 }).exec(function(err, docs) {
        if (err) {
            console.log("Datalist For operator Error " + err);
            res.send("error");
        } else {
            var datalistData = [],
                len = docs.length;

            for (var i = 0; i < len; ++i) {
                datalistData.push(docs[i].field.operator);
            }
            res.send(datalistData);
        }
    });
});

/* ************************************ */
/* MACHINE'S CHECKING FUNCTIONS */

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

/* ************************************ */
/* WORKROLL'S CHECKING FUNCTIONS */

// check if a work roll with a name exists
router.get('/checkIfWorkRollExists', function (req, res, next) {
  db.workroll.find({
    roll: req.query.data
  }).projection({ status: 1 }).exec(function (err, docs) {
      if (err) {
          console.log("Error happened while /checkIfWorkRollExists : " + err);
          res.send("error");
      } else {
          if (docs.length > 1) {
              res.send("multiple");
          } else if (docs.length === 1) {
                if(docs[0].status === "new")
                    res.send("exists");
                else
                    res.send("old");
          } else {
              res.send("doesNotexist");
          }
      }
  });
});

module.exports = router;
