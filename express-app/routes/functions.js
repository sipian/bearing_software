function makeTableBearing(uniqueDate, uniqueDateLen, typeArray) {
  var ans = [],
      counter = 0,
      prev_date = new Date(0),
      check_initial_date = prev_date,
      type_array_len = typeArray.length;

  if(type_array_len == 0)
    return Array(uniqueDateLen).fill({});

  for (var i = 0; i < uniqueDateLen; ++i) {

    if(counter < type_array_len && (uniqueDate[i]).getTime() === ((typeArray[counter]).date).getTime()) {
      if(prev_date === check_initial_date) {
        ans.push({
          make: (typeArray[counter]).make,
          comment: (typeArray[counter]).comment,
          lifeTime: ""
        });
      }
      else {
        ans.push({
          make: (typeArray[counter]).make,
          comment: (typeArray[counter]).comment,
          lifeTime: monthDiff_Local(uniqueDate[i], prev_date)
        });
      }
      prev_date = uniqueDate[i];
      counter++;
    }
    else {
      ans.push({});
    }
  }
  return ans;
}

function formattedDate_Local(d = new Date()) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return `${day}/${month}/${year}`;
}

function formattedTime_Local(d = new Date()) {
  let hour = String(d.getHours());
  let minutes = String(d.getMinutes());

  if (hour.length < 2)
    hour = '0' + hour;
  if (minutes.length < 2)
    minutes = '0' + minutes;

  return `${hour}:${minutes}`;
}

function isEmptyObject_Local(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

function monthDiff_Local(d_new, d_old) {
  var difdt = new Date(d_new - d_old);
  var years = parseInt(difdt.toISOString().slice(0, 4) - 1970);
  var months = parseInt(difdt.getMonth()) + years*12;
  return (months.toString() + "M&nbsp;" + difdt.getDate() + "D");
}

function timeDiff_Local(d_new, d_old) {
  var difMs = d_new - d_old;
  var diffHrs = Math.floor(difMs / 3600000); // hours
  var diffMins = Math.round((difMs % 3600000) / 60000); // minutes
  return (diffHrs.toString() + "H&nbsp;" + diffMins.toString() + "M");
}

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

	formattedDate: formattedDate_Local,
  formattedTime: formattedTime_Local,
	isEmptyObject: isEmptyObject_Local,
	monthDiff: monthDiff_Local,
	timeDiff: timeDiff_Local,

  machineBearingMakeTable: function(bearing, startingDate, endingDate) {
    bearing.sort(function(a, b){
      return a.date - b.date;
      });
    // arrays to hold unique entry for each bearing sorted by date
    var DDO = [], DDI = [] ,
        DUO = [], DUI = [] ,
        GDO = [], GDI = [] ,
        GUO = [], GUI = [] ,
        unique_date = [],  // array to store the unique dates sorted by date
        len = bearing.length,
        unique_date_len = 0,
        i = 0;

    // filling the arrays
    for (i = 0; i < len; ++i) {
        unique_date_len = unique_date.length;
        if(bearing[i].date < startingDate || bearing[i].date > endingDate)
          continue;

        switch(bearing[i].type) {
          case "ddo" : DDO.push(bearing[i]);
                       break;
          case "ddi" : DDI.push(bearing[i]);
                      break;
          case "duo" : DUO.push(bearing[i]);
                       break;
          case "dui" : DUI.push(bearing[i]);
                       break;
          case "gdo" : GDO.push(bearing[i]);
                       break;
          case "gdi" : GDI.push(bearing[i]);
                       break;
          case "guo" : GUO.push(bearing[i]);
                       break;
          case "gui" : GUI.push(bearing[i]);
                       break;
          default : return `<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a><strong>ERROR! </strong>Invalid Bearing Type : ${bearing[i].type}</div>`;
        }
        if(unique_date_len === 0) {
          unique_date.push(bearing[i].date);
        } else if(bearing[i].date.getTime() !== (unique_date[unique_date_len-1]).getTime())  //checking for duplicacity
            unique_date.push(bearing[i].date);
    }
    unique_date_len = unique_date.length;

  var htmlToSend = `<div class="table container-fluid"><table class="table table-bordered table-condensed table-striped"><tr><th>S No.<th>Date<th colspan=6  style="border-right: thick outset red;">Dab Side Up<th colspan=6 scope=col>Dab Side Down<th class=emptyInMiddle><th colspan=6 style="border-right: thick outset red;">Gear Side Up<th colspan=6 scope=col>Gear Side Down<tr><th><th><th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3 style="border-right: thick outset red;">OUT<th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3 scope=col>OUT<th class=emptyInMiddle><th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3 style="border-right: thick outset red;">OUT<th colspan=3 style="border-right: thick outset blue;">IN<th colspan=3>OUT<tr style="border-bottom:medium solid #000"><th><th><th>make<th>cmt.<th style="border-right: thick outset blue;">diff<th>make<th>cmt.<th style="border-right: thick outset red;">diff<th>make<th>cmt.<th style="border-right: thick outset blue;">diff<th>make<th>cmt.<th>diff<th class=emptyInMiddle><th>make<th>cmt.<th  style="border-right: thick outset blue;">diff<th>make<th>cmt.<th  style="border-right: thick outset red;">diff<th>make<th>cmt.<th  style="border-right: thick outset blue;">diff<th>make<th>cmt.<th>diff</tr>`;

  // filling the arrays for the various types
  var DDO_ans = makeTableBearing(unique_date, unique_date_len, DDO),
      DDI_ans = makeTableBearing(unique_date, unique_date_len, DDI),
      DUO_ans = makeTableBearing(unique_date, unique_date_len, DUO),
      DUI_ans = makeTableBearing(unique_date, unique_date_len, DUI),

      GDO_ans = makeTableBearing(unique_date, unique_date_len, GDO),
      GDI_ans = makeTableBearing(unique_date, unique_date_len, GDI),
      GUO_ans = makeTableBearing(unique_date, unique_date_len, GUO),
      GUI_ans = makeTableBearing(unique_date, unique_date_len, GUI);

  for (i = 0; i < unique_date_len; ++i) {
    htmlToSend += `<tr style="border-bottom:0px solid #000"><td>${i+1}<td>${formattedDate_Local(unique_date[i])}`;
    if(isEmptyObject_Local(DUI_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset #00f">`;
    else htmlToSend += `<td>${DUI_ans[i].make}<td class="toolDiv"><div rel="tooltip" title="${DUI_ans[i].comment}">${DUI_ans[i].comment}<td style="border-right:thick outset #00f">${DUI_ans[i].lifeTime}`;
    if(isEmptyObject_Local(DUO_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset red">`;
    else htmlToSend += `<td>${DUO_ans[i].make}<td class="toolDiv"><div rel="tooltip" title="${DUO_ans[i].comment}">${DUO_ans[i].comment}<td style="border-right:thick outset red">${DUO_ans[i].lifeTime}`;

    if(isEmptyObject_Local(DDI_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset #00f">`;
    else htmlToSend += `<td>${DDI_ans[i].make}<td class="toolDiv"><div rel="tooltip" title="${DDI_ans[i].comment}">${DDI_ans[i].comment}<td style="border-right:thick outset #00f">${DDI_ans[i].lifeTime}`;
    if(isEmptyObject_Local(DDO_ans[i])) htmlToSend += `<td><td><td>`;
    else htmlToSend += `<td>${DDO_ans[i].make}<td class="toolDiv"><div rel="tooltip" title="${DDO_ans[i].comment}">${DDO_ans[i].comment}<td>${DDO_ans[i].lifeTime}`;

    htmlToSend += `<td class=emptyInMiddle>`;

    if(isEmptyObject_Local(GUI_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset #00f">`;
    else htmlToSend += `<td>${GUI_ans[i].make}<td class="toolDiv"><div rel="tooltip" title="${GUI_ans[i].comment}">${GUI_ans[i].comment}<td style="border-right:thick outset #00f">${GUI_ans[i].lifeTime}`;
    if(isEmptyObject_Local(GUO_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset red">`;
    else htmlToSend += `<td>${GUO_ans[i].make}<td class="toolDiv"><div rel="tooltip" title="${GUO_ans[i].comment}">${GUO_ans[i].comment}<td style="border-right:thick outset red">${GUO_ans[i].lifeTime}`;

    if(isEmptyObject_Local(GDI_ans[i])) htmlToSend += `<td><td><td style="border-right:thick outset #00f">`;
    else htmlToSend += `<td>${GDI_ans[i].make}<td class="toolDiv"><div rel="tooltip" title="${GDI_ans[i].comment}">${GDI_ans[i].comment}<td style="border-right:thick outset #00f">${GDI_ans[i].lifeTime}`;
    if(isEmptyObject_Local(GDO_ans[i])) htmlToSend += `<td><td><td>`;
    else htmlToSend += `<td>${GDO_ans[i].make}<td class="toolDiv"><div rel="tooltip" title="${GDO_ans[i].comment}">${GDO_ans[i].comment}<td>${GDO_ans[i].lifeTime}`;

    htmlToSend += "</tr>";
    }
    htmlToSend += "</table></div>";
    return htmlToSend;
  },
  machineBackUpRollMakeTable : function(backUpRoll, starting_date, ending_date) {
    backUpRoll.sort(function(a, b){
      let diff = a.date.getTime() - b.date.getTime();
      if(diff != 0)
        return diff;
      else
        return ((a.type > b.type)? 1:-1);
      });
    var len = backUpRoll.length,
        i = 0,
        htmlToSend = `<div class="table container-fluid"><table class="table table-bordered table-condensed table-striped"><tr><th>S No.<th>Date<th colspan=2>Back Up Roll 1<th class=emptyInMiddle><th colspan=2>Back Up Roll 2<tr style="border-bottom: thick solid black;"><th><th><th>Diameter<th>Comment<th class=emptyInMiddle><th>Diameter<th>Comment</tr>`;

    // filling the table
    let counter = 1;
    for (i = 0; i < len; ++i) {
        let curr_date = backUpRoll[i].date;
        if(curr_date < starting_date || curr_date > ending_date)
          continue;

        htmlToSend += `<tr><td>${counter++}</td><td>${formattedDate_Local(backUpRoll[i].date)}</td>`;

        if(backUpRoll[i].type === "1") {
          htmlToSend += `<td>${backUpRoll[i].dia}</td><td>${backUpRoll[i].comment}</td>`;
          htmlToSend += `<td class=emptyInMiddle></td>`;
          if(i<len-1 && backUpRoll[i+1].date.getTime() === backUpRoll[i].date.getTime() && backUpRoll[i+1].type === "2") {
              htmlToSend += `<td>${backUpRoll[i+1].dia}</td><td>${backUpRoll[i+1].comment}</td>`;
              ++i;
          } else
              htmlToSend += `<td></td><td></td>`;
          } else {
              htmlToSend += `<td></td><td></td>`;
              htmlToSend += `<td class=emptyInMiddle></td>`;
              htmlToSend += `<td>${backUpRoll[i].dia}</td><td>${backUpRoll[i].comment}</td>`;
        }
        htmlToSend += `</tr>`;
    }
    htmlToSend += `</table></div>`;
    return htmlToSend;
  },
  machineWorkRollMakeTable : function (workRoll , status, startingDate, endingDate) {
    workRoll.sort(function(a, b){
      return a.g_time - b.g_time;
      });
    var len = workRoll.length,
        i = 0,
        htmlToSend = `<pre class="container" style="text-align:center;"><h5>WORK ROLL STATUS :- ${status}</h5></pre><div class="table container-fluid"><table class="table table-bordered table-condensed table-striped"><tr><th>S No.<th>Mach. No.<th colspan=2>Mach. Up<th colspan=2>Mach. Down<th>Working Time<th style="border-right: thick solid red;">Reason<th colspan=2>Grinding Time<th>Cooling Time<th>Diameter<th>Grinding Operator<th>Comment<tr style="border-bottom: thick solid black;"><th><th><th>Date<th>Time<th>Date<th>Time<th><th style="border-right: thick solid red;"><th>Date<th>Time<th>Cooling Time<th><th><th></tr>`;

    // filling the table
    let counter = 1;
    for (i = 0; i < len; ++i) {
        if(workRoll[i].g_time < startingDate || workRoll[i].g_time > endingDate)
          continue;

        htmlToSend += `<tr>
                           <td>${counter++}</td>
                           <td>${workRoll[i].m_no}</td>
                           <td>${formattedDate_Local(workRoll[i].m_up)}</td>
                           <td>${formattedTime_Local(workRoll[i].m_up)}</td>
                           <td>${formattedDate_Local(workRoll[i].m_down)}</td>
                           <td>${formattedTime_Local(workRoll[i].m_down)}</td>
                           <td>${timeDiff_Local(workRoll[i].m_down,workRoll[i].m_up)}</td>
                           <td style="border-right: thick solid red;">${workRoll[i].reason}</td>
                           <td>${formattedDate_Local(workRoll[i].g_time)}</td>
                           <td>${formattedTime_Local(workRoll[i].g_time)}</td>
                           <td>${timeDiff_Local(workRoll[i].g_time,workRoll[i].m_down)}</td>
                           <td>${workRoll[i].dia}</td>
                           <td>${workRoll[i].operator}</td>
                           <td>${workRoll[i].comment}</td>
                      </tr>`;
    }
    htmlToSend += `</table></div>`;
    return htmlToSend;
  }
};
