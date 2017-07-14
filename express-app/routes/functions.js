const date1 = require('date-and-time');

module.exports = {
	checkDate : function(date, startingDate, endingDate) {
    let dateFunction = date1.parse(date, 'DD-MM-YYYY');
    let sdFunction = date1.parse(startingDate, 'DD-MM-YYYY');
    let edFunction = date1.parse(endingDate, 'DD-MM-YYYY');
    if (dateFunction >= sdFunction && dateFunction <= edFunction) return true;
    else return false;
	},
  foo: function () {
    // whatever
  },
  bar: function () {
    // whatever
  }
};