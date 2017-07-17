const Datastore = require('nedb');
var db = {};
db.machine = new Datastore({
        filename: 'database/machine.txt',
        autoload: true,
        onload(err) {
            if (err) {
                console.log("Error in opening Database machine.txt error : " + err);
                process.exit(1);
            } else {
                console.log("Successfully opened Database machine.txt");
                // Using a sparse unique index
                db.machine.ensureIndex({
                    fieldName: 'm_no',
                    unique: true,
                    sparse: true
                }, function(err) {
                    if (err) {
                        console.log("Error in creating index error : " + err);
                        process.exit(1);
                    } else {
                        console.log("Created Index Successfully For machine.txt");
                    }
                });
            }
        }
});

db.workroll = new Datastore({
        filename: 'database/workroll.txt',
        autoload: true,
        onload(err) {
            if (err) {
                console.log("Error in opening Database workroll.txt error : " + err);
                process.exit(1);
            } else {
                console.log("Successfully opened Database workroll.txt");
                // Using a sparse unique index
                db.workroll.ensureIndex({
                    fieldName: 'roll_no',
                    unique: true,
                    sparse: true
                }, function(err) {
                    if (err) {
                        console.log("Error in creating index error : " + err);
                        process.exit(1);
                    } else {
                        console.log("Created Index Successfully for workroll.txt");
                    }
                });
            }
        }
});

module.exports = db;
