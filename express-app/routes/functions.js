
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
	}
};
