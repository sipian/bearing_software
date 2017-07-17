
module.exports = {
  getMachineTypeName : function(type) {
    switch(type) {
      case 'gui' : return 'Gear Side > Upper > In ';
      case 'guo' : return 'Gear Side > Upper > Out ';
      case 'gdi' : return 'Gear Side > Down > In ';
      case 'gdo' : return 'Gear Side > Down > Out ';
      case 'dui' : return 'Dab Side > Upper > In ';
      case 'duo' : return 'Dab Side > Upper > Out ';
      case 'ddi' : return 'Dab Side > Down > In ';
      case 'ddo' : return 'Dab Side > Down > Out ';
      default : return 'undefined';
    }
  },
	formattedDate: function (d = new Date()) {
  	let month = String(d.getMonth() + 1);
  	let day = String(d.getDate());
  	const year = String(d.getFullYear());

  	if (month.length < 2)
			month = '0' + month;
  	if (day.length < 2)
			day = '0' + day;

		return `${day}/${month}/${year}`;
	},
  formattedTime: function (d = new Date()) {
  	let hour = String(d.getHours());
  	let minutes = String(d.getMinutes());

  	if (hour.length < 2)
			hour = '0' + hour;
  	if (minutes.length < 2)
			minutes = '0' + minutes;

		return `${hour}:${minutes}`;
	},
	isEmptyObject: function(obj) {
  	for (var key in obj) {
    	if (Object.prototype.hasOwnProperty.call(obj, key)) {
      	return false;
    	}
  	}
  	return true;
	},
	monthDiff: function(d_new, d_old) {
		var difdt = new Date(d_new - d_old);
		var years = parseInt(difdt.toISOString().slice(0, 4) - 1970);
		var months = parseInt(difdt.getMonth()) + years*12;
		return (months.toString() + "M " + difdt.getDate() + "D");
	},
	timeDiff: function(d_new, d_old) {
		var difMs = d_new - d_old;
    var diffHrs = Math.floor(difMs / 3600000); // hours
    var diffMins = Math.round((difMs % 3600000) / 60000); // minutes
		return (diffHrs.toString() + "H " + diffMins.toString() + "M");
  }
};
