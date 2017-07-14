const Datastore = require('nedb');
var db = new Datastore({
        filename: 'gradle/gradle.txt',
        autoload: true,
        onload(err) {
            if (err) {
                //log.info("Error in opening Database" + err);
                process.exit(1);
            } else {
                //log.info("Successfully opened Database");
                // Using a sparse unique index

                db.ensureIndex({
                    fieldName: 'name',
                    unique: true,
                    sparse: true
                }, function(err) {
                    if (err) {
                        //log.info("Error in creating index");
                        process.exit(1);
                    } else {
                        //log.info("Created Index Successfully");
                    }
                });

            }
        }
    });
module.exports = db;
