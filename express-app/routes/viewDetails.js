const express = require('express'),
    utilityFunctions = require('./functions.js'),
    router = express.Router();
var db = require("./db.js");
router.get('/viewBalanceOf1Item', function(req, res, next) {
    db.find({
        name: decodeURIComponent(req.query.data)
    }, function(err, docs) {
        if (err) {
            res.send("error");
        } else {
            if (docs.length == 1) {
                let htmlToSend = `
      <table class="table table-bordered table-striped table-condensed table-responsive">
      <caption style="font-size:40px;"><strong>Current Balance of Item :- ${req.query.data}</strong></caption>
      <thead>
        <tr id="head">
          <td>S No.</td>
          <td>Name</td>
          <td>Balance</td>
          <td>Unit</td>
          <td>Group</td>
        </tr>
      </thead>
      <tbody>
        <tr class="warning">
          <td> 1 </td>
          <td style="font-size:20px;">${docs[0].name}</td>
          <td style="font-size:20px;">${docs[0].balance}</td>
          <td style="font-size:20px;">${docs[0].unit}</td>
          <td style="font-size:20px;">${docs[0].group}</td>
        </tr>
      </tbody>
      </table>
      `;
                //log.info(htmlToSend);
                res.send(htmlToSend);
            } else if (docs.length == 0)
                res.send("doesNotexist");
            else
                res.send("2NameExist");
        }
    });
});
router.get('/viewDetailsOf1Item', function(req, res, next) {
    //log.info("get request for viewDetailsOf1Item");
    req.query.data = decodeURIComponent(req.query.data);
    req.query.startingDate = decodeURIComponent(req.query.startingDate);
    req.query.endingDate = decodeURIComponent(req.query.endingDate);

    db.find({
        name: req.query.data
    }, function(err, docs) {
        //log.info(docs);
        if (err) {
            //log.info("Error happened while /viewDetailsOf1Item : " + err);
            res.send("error");
        } else {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = dd + '-' + mm + '-' + yyyy;
            let startDate = (req.query.startingDate) ? req.query.startingDate : docs[0].date[0];
            let endDate = (req.query.endingDate) ? req.query.endingDate : today;
            if (docs.length == 1) {
                //log.info("Viewing details of 1 item");
                let htmlToSend = `
      <table class="table table-bordered table-striped table-condensed table-responsive" >
           <caption style="font-size:30px;">
        Detailed Summary of Item :- ${req.query.data}(${startDate} to ${endDate}) 
      </caption>
      <thead>
        <tr id="head">
          <td>S No.</td>
          <td>Date</td>
          <td>Unit</td>
          <td>Group</td>
          <td>Qty. Issued</td>
          <td>Whom To Issue</td>
          <td>Purpose Of Issue</td>
          <td>Qty. Received</td>
          <td>Make</td>
          <td>Bill no./Dispatch Details</td>
          <td>Balance</td>
        </tr>
      </thead>
      <tbody>
      <tr class="warning">
        <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>Opening Balance : ${docs[0].openingBalance}</td><td></td></tr>`;
                let printBalance = 0;
                let counter = 1;
                let totalQuantityIssued = 0, totalQuantityReceived = 0;
                for (let i = 0; i < docs[0].date.length; i++) {
                    //log.info(i);
                    if (docs[0].items_given_to_staff[i] != 0) printBalance = printBalance - docs[0].items_given_to_staff[i];
                    else if (docs[0].items_added_to_Stock[i] != 0) printBalance = printBalance + docs[0].items_added_to_Stock[i];
                    if (utilityFunctions.checkDate(docs[0].date[i], startDate, endDate)) {
                        //log.info("if condition " + i);
                        if (i)
                                htmlToSend += `<tr class="warning"><td>${counter}</td>`;
                        else
                                htmlToSend += `<tr class="warning"><td>${counter}-O.B.</td>`;

                        htmlToSend += `<td>${((docs[0].date[i] == null) ? `--` : docs[0].date[i])}</td>
              <td>${((docs[0].unit == null) ? `--` : docs[0].unit)}</td>
              <td>${((docs[0].group == null) ? `--` : docs[0].group)}</td>
              <td>${((docs[0].items_given_to_staff[i] == '0') ? `--` : docs[0].items_given_to_staff[i])}</td>
              <td>${((docs[0].whom_to_issue[i] == null) ? `--` : docs[0].whom_to_issue[i])}</td>
              <td>${((docs[0].purpose_of_issue[i] == null) ? `--` : docs[0].purpose_of_issue[i])}</td>
              <td>${((docs[0].items_added_to_Stock[i] == '0') ? `--` : docs[0].items_added_to_Stock[i])}</td>
              <td>${((docs[0].make[i] == null) ? `--` : docs[0].make[i])}</td>
              <td>${((docs[0].bill[i] == null) ? `--` : docs[0].bill[i])}</td>
              <td>${printBalance}</td>
            </tr>`;
                        totalQuantityIssued += docs[0].items_given_to_staff[i];
                        totalQuantityReceived += docs[0].items_added_to_Stock[i];
                        ++counter;
                    }
                }                
                htmlToSend += `
      <tr class="warning">
        <td></td><td></td><td></td>
        <td></td>
        <td style='background-color:#6666ff;color:white;'>Total = ${totalQuantityIssued}</td>
        <td></td>
        <td></td>
        <td style='background-color:#00b300;color:white;'>Total = ${totalQuantityReceived}</td>
        <td style='background-color:#6666ff;color:white;'>Current Balance : ${docs[0].balance}</td><td></td>
      </tr>
      </tbody>
      </table>`;
                res.send(htmlToSend);
            } else if (docs.length == 0)
                res.send("doesNotexist");
            else
                res.send("2NameExist");
        }

    });

});



var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var htmlToSend = "";

function makeReport(arrayForDataListGroupLocal, item, index, length, res, includeItemWithNoActivity,
    firstDayStarting, firstDayEnding, midDayStarting, midDayEnding, lastDayStarting, lastDayEnding, counterReport, diff, 
    sumOfItemsIssuedMonth1, sumOfItemsIssuedMonth2, sumOfItemsIssuedMonth3, withoutNegative) {

    let groupNamehtml = `
  <tr class="default" style=" line-height: 14px;">
    <td></td>
    <td><strong>${item}</strong></td>
    <td style='background-color:black;'></td><td style='background-color:black;'></td><td style='background-color:black;'></td>`;

    if (diff >= 2) {
        groupNamehtml += `<td></td><td></td><td></td>`;
    }
    if (diff == 3) {
        groupNamehtml += `<td></td><td></td><td></td><td></td>`;
    }
    groupNamehtml += "</tr>";

    let tempStringForCheckingEmptyGroup = "";

    let totalItemsIssuedMonth1 = 0, totalItemsIssuedMonth2 = 0, totalItemsIssuedMonth3 = 0;
    
    db.find({
        group: item
    }).sort({
        name: 1
    }).exec(function(err, docs) {
        if (err) {
            //log.info("Error happened while /generating report : " + err);
            res.send("error");
        } 
        else if (docs.length >= 0) {
            //loop to iterate over each item in the group
            let len = docs.length;
            for (let i = 0; i < len; i++) {
                let counterArray = [0, 0, 0];
                let tempStringCheckActivity = `<tr class="warning"><td>${counterReport}</td><td>${docs[i].name}</td><td>${docs[i].make[0]}</td><td>${docs[i].unit}</td>`;

                // looping to get the sum of issued items over the period
                let lenDate = docs[i].date.length;
                let currBalanceLastMonth = 0;
                for (let j = 0; j < lenDate; j++) {
                    let currentDate = new Date(parseInt(docs[i].date[j].substring(docs[i].date[j].lastIndexOf('-') + 1)), parseInt(docs[i].date[j].substring(docs[i].date[j].indexOf('-') + 1, docs[i].date[j].lastIndexOf('-'))) - 1, parseInt(docs[i].date[j].substring(0, docs[i].date[j].indexOf('-'))));
                    if (diff >= 1)
                        if (currentDate >= firstDayStarting && currentDate <= firstDayEnding)
                            counterArray[0] += parseFloat(docs[i].items_given_to_staff[j]);
                    if (diff >= 2)
                        if (currentDate >= midDayStarting && currentDate <= midDayEnding)
                            counterArray[1] += parseFloat(docs[i].items_given_to_staff[j]);
                    if (diff == 3) {
                        if(currentDate <= lastDayEnding)
                        {
                                currBalanceLastMonth -= parseFloat(docs[i].items_given_to_staff[j]);
                                currBalanceLastMonth += parseFloat(docs[i].items_added_to_Stock[j]);      
                        } 
                        if (currentDate >= lastDayStarting && currentDate <= lastDayEnding)
                            counterArray[2] += parseFloat(docs[i].items_given_to_staff[j]);
                        }
                }
                counterArray[0] = Math.round(counterArray[0]*100)/100;
                counterArray[1] = Math.round(counterArray[1]*100)/100;
                counterArray[2] = Math.round(counterArray[2]*100)/100;
                
                // adding monthly consumption to html data
                if (diff >= 1)
                    tempStringCheckActivity += `<td>${counterArray[0]}</td>`;
                if (diff >= 2)
                    tempStringCheckActivity += `<td>${counterArray[1]}</td>`;
                if (diff == 3)
                    tempStringCheckActivity += `<td>${counterArray[2]}</td><td>${Math.round(currBalanceLastMonth*100)/100}</td>`;

                tempStringCheckActivity += `<td>${Math.round(docs[i].balance*100)/100}</td>`;

                if (diff == 3) {
                    let qtyRequired = Math.round((parseFloat((counterArray[0] + counterArray[1] + counterArray[2]) / 2) - parseFloat(currBalanceLastMonth))*100)/100;
                    
                    if(withoutNegative==0 && qtyRequired <= 0)
                        continue;
                    tempStringCheckActivity += `<td>${qtyRequired}</td><td style="width: 20px;"></td>`;
                }

                // checking if 0 items to be included or not
                tempStringCheckActivity += `<td></td></tr>`;

                // no restrictions
                if (includeItemWithNoActivity == 0) {
                    totalItemsIssuedMonth1 += counterArray[0];
                    totalItemsIssuedMonth2 += counterArray[1];
                    totalItemsIssuedMonth3 += counterArray[2];
                    tempStringForCheckingEmptyGroup += tempStringCheckActivity;
                    ++counterReport;
                }
                // remove items with no activity in the period
                else if (includeItemWithNoActivity == 1 && (counterArray[0] != 0 || counterArray[1] != 0 || counterArray[2] != 0)) {
                    totalItemsIssuedMonth1 += counterArray[0];
                    totalItemsIssuedMonth2 += counterArray[1];
                    totalItemsIssuedMonth3 += counterArray[2];
                    tempStringForCheckingEmptyGroup += tempStringCheckActivity;
                    ++counterReport;
                }
                // remove items with no activity in the last month provided
                else if (includeItemWithNoActivity == 2) {
                        if( diff == 1 && counterArray[0] != 0) {
                            totalItemsIssuedMonth1 += counterArray[0];
                            tempStringForCheckingEmptyGroup += tempStringCheckActivity;
                            ++counterReport;
                        }
                        else if( diff == 2 && counterArray[1] != 0) {
                            totalItemsIssuedMonth1 += counterArray[0];
                            totalItemsIssuedMonth2 += counterArray[1];
                            tempStringForCheckingEmptyGroup += tempStringCheckActivity;
                            ++counterReport;
                        }
                        else if( diff == 3 && counterArray[2] != 0) {
                            totalItemsIssuedMonth1 += counterArray[0];
                            totalItemsIssuedMonth2 += counterArray[1];
                            totalItemsIssuedMonth3 += counterArray[2];
                            tempStringForCheckingEmptyGroup += tempStringCheckActivity;
                            ++counterReport;
                        }
                    }
                }
        }

        if (tempStringForCheckingEmptyGroup != "") {
            let finalLine = `
            <tr class="default" style=" line-height: 14px;">
                <td></td><td></td><td></td>
                <td style='background-color:#6666ff;color:white;'>TOTAL </td>`;
            if (diff >= 1)
                finalLine += `<td>${Math.round(totalItemsIssuedMonth1*100)/100}</td>`;
            if (diff >= 2)
                finalLine += `<td>${Math.round(totalItemsIssuedMonth2*100)/100}</td>`;
            if (diff == 3)
                finalLine += `<td>${Math.round(totalItemsIssuedMonth3*100)/100}</td>`;
            finalLine += `<td></td><td></td>`;
            if (diff == 3)
                finalLine += `<td></td><td></td><td></td>`;
            finalLine += `</tr>`;
            htmlToSend += groupNamehtml + tempStringForCheckingEmptyGroup + finalLine;
            sumOfItemsIssuedMonth1 += totalItemsIssuedMonth1;
            sumOfItemsIssuedMonth2 += totalItemsIssuedMonth2;
            sumOfItemsIssuedMonth3 += totalItemsIssuedMonth3;
        }
        index++;
        if (index < length) {
            makeReport(arrayForDataListGroupLocal, arrayForDataListGroupLocal[index], index, length, res, includeItemWithNoActivity,
                firstDayStarting, firstDayEnding, midDayStarting, midDayEnding, lastDayStarting, lastDayEnding, counterReport, diff, 
                sumOfItemsIssuedMonth1, sumOfItemsIssuedMonth2, sumOfItemsIssuedMonth3, withoutNegative);
        }
        else
        {
           htmlToSend += `
            <tr class="default" style=" line-height: 14px;">
                <td></td><td></td><td></td>
                <td style='background-color:#6666ff;color:white;'>GRAND TOTAL</td>`;
            let finalAns = 0;
            if(diff>=1) {
                htmlToSend += `<td>${Math.round(sumOfItemsIssuedMonth1*100)/100}</td>`;
                finalAns += sumOfItemsIssuedMonth1;
            }
            if(diff>=2) {
                htmlToSend += `<td>${Math.round(sumOfItemsIssuedMonth2*100)/100}</td>`;
                finalAns += sumOfItemsIssuedMonth2;
            }
            if(diff==3) {
                htmlToSend += `<td>${Math.round(sumOfItemsIssuedMonth3*100)/100}</td>`;
                finalAns += sumOfItemsIssuedMonth3;
            }
             htmlToSend += `<td> TOTAL SUM = ${Math.round(finalAns*100)/100}</td><td></td>`;
             if (diff == 3)
                htmlToSend += `<td></td><td></td><td></td>`;
            
             htmlToSend += `
            </tr>
                </tbody>
                </table>
            <div class="container container-table" style="margin-top:-5%;">
              <div class="row vertical-center-row">
                  <div class="text-center col-md-2 col-md-offset-4" style="background:lavenderblush">
                      <strong><i>****End Of Report****</i></strong>
                  </div>
              </div>
          </div>`;
                    res.send(htmlToSend);     
        }
    });
}


router.get('/viewFullReport', function(req, res, next) {

    //log.info("/viewFullReport" , req.query);
    let diff = parseInt(req.query.diff);
    let group;
    if (typeof(req.query.group) != 'undefined')
        group = decodeURIComponent(req.query.group.trim());
    let startingMonth = parseInt(req.query.startingMonth);
    let startingYear = parseInt(req.query.startingYear);
    let endingMonth = parseInt(req.query.endingMonth);
    let endingYear = parseInt(req.query.endingYear);
    let midMonth = (startingMonth + 1) % 12;
    let midYear = (startingMonth === 11) ? endingYear : startingYear;

    let firstDayStarting = new Date(startingYear, startingMonth, 1);
    let firstDayEnding = new Date(startingYear, startingMonth + 1, 0);

    let lastDayStarting = new Date(endingYear, endingMonth, 1);
    let lastDayEnding = new Date(endingYear, endingMonth + 1, 0);

    let midDayStarting = new Date(midYear, midMonth, 1);
    let midDayEnding = new Date(midYear, midMonth + 1, 0);
    htmlToSend = `
<table class="table table-bordered table-striped table-condensed table-responsive" id="myTable">
  <thead>
    <tr id="head" class="success">
      <td><font size="4"><strong>S NO.</strong></font></td>
      <td><font size="4"><strong>NAME OF ITEM</strong></font></td>
      <td><font size="4"><strong>MAKE</strong></font></td>
      <td><font size="4"><strong>UNIT</strong></font></td>`;

    if (diff == 1)
        htmlToSend += `<td><font size="4"><strong>Month I <br>${monthNames[startingMonth]}&nbsp;&nbsp;${startingYear}</strong></font></td>`;
    else if (diff == 2)
        htmlToSend += `<td><font size="4"><strong>Month I <br>${monthNames[startingMonth]}&nbsp;&nbsp;${startingYear}</strong></font></td><td><font size="4"><strong>Month II <br>${monthNames[endingMonth]}&nbsp;&nbsp;${endingYear}</strong></font></td>`;
    else
        htmlToSend += `<td><font size="4"><strong>Month I <br>${monthNames[startingMonth]}&nbsp;&nbsp;${startingYear}</strong></font></td><td><font size="4"><strong>Month II <br>${monthNames[midMonth]}&nbsp;&nbsp;${midYear}</strong></font></td><td><font size="4"><strong>Month III <br>${monthNames[endingMonth]}&nbsp;&nbsp;${endingYear}</strong></font></td><td><font size="4"><strong>Balance At End<br>Of ${monthNames[endingMonth]}&nbsp;&nbsp;${endingYear}</strong></font></td>`;

    htmlToSend += `<td><font size="4"><strong>Bal.<br>Stock</td>`;

    if (diff == 3)
        htmlToSend += `<td><font size="4"><strong>Qty.<br>Req.</strong></font></td> <td style="width: 20px;"><font size="4"><strong>Final<br>Req.</strong></font></td>`;

    htmlToSend += `<td><font size="4"><strong>Remark</strong></font></td></tr></thead><tbody>`;
    let arrayForDataListGroup = [];

    if (typeof(req.query.group) != 'undefined') {
        arrayForDataListGroup = [group];
        if (arrayForDataListGroup.length > 0)
            makeReport(arrayForDataListGroup, arrayForDataListGroup[0], 0, 1, res, parseInt(req.query.includeItemWithNoActivity),
                firstDayStarting, firstDayEnding, midDayStarting, midDayEnding, lastDayStarting, lastDayEnding, 1, diff,0,0,0, req.query.withoutNegative);
        else
            res.send('<br><br><br><br><h4 style="color:red;text-align:center;" >No Items Found.</h4>');
    } else {
        db.find({}).sort({
            group: 1
        }).exec(function(err, docs) {
            if (err) {
                res.send("error2");
            } else {
                let datalistData = "";
                for (let i = 0; i < docs.length; i++) {
                    if (datalistData.indexOf(docs[i].group) == -1) {
                        datalistData = datalistData + docs[i].group + "!@#$%^&*";
                        arrayForDataListGroup.push(docs[i].group);
                    }
                }
                if (arrayForDataListGroup.length > 0)
                    makeReport(arrayForDataListGroup, arrayForDataListGroup[0], 0, arrayForDataListGroup.length, res, parseInt(req.query.includeItemWithNoActivity),
                        firstDayStarting, firstDayEnding, midDayStarting, midDayEnding, lastDayStarting, lastDayEnding, 1, diff,0,0,0,req.query.withoutNegative);
                else
                    res.send('<br><br><br><br><h4 style="color:red;text-align:center;" >No Items Found.</h4>');
            }
        })

    }
});

router.get('/viewReportOfOneItem', function(req, res, next) {

    let diff = parseInt(req.query.diff);
    let item_name = decodeURIComponent(req.query.item_name.trim());
    let startingMonth = parseInt(req.query.startingMonth);
    let startingYear = parseInt(req.query.startingYear);
    let endingMonth = parseInt(req.query.endingMonth);
    let endingYear = parseInt(req.query.endingYear);
    let midMonth = (startingMonth + 1) % 12;
    let midYear = (startingMonth === 11) ? endingYear : startingYear;

    let firstDayStarting = new Date(startingYear, startingMonth, 1);
    let firstDayEnding = new Date(startingYear, startingMonth + 1, 0);

    let lastDayStarting = new Date(endingYear, endingMonth, 1);
    let lastDayEnding = new Date(endingYear, endingMonth + 1, 0);

    let midDayStarting = new Date(midYear, midMonth, 1);
    let midDayEnding = new Date(midYear, midMonth + 1, 0);
    let htmlToSend = `
<table class="table table-bordered table-striped table-condensed table-responsive" id="myTable">
  <thead>
    <tr id="head" class="success">
      <td><font size="4"><strong>S NO.</strong></font></td>
      <td><font size="4"><strong>NAME OF ITEM</strong></font></td>
      <td><font size="4"><strong>MAKE</strong></font></td>
      <td><font size="4"><strong>GROUP</strong></font></td>
      <td><font size="4"><strong>UNIT</strong></font></td>`;

    if (diff == 1)
        htmlToSend += `<td><font size="4"><strong>Month I <br>${monthNames[startingMonth]}&nbsp;&nbsp;${startingYear}</strong></font></td>`;
    else if (diff == 2)
        htmlToSend += `<td><font size="4"><strong>Month I <br>${monthNames[startingMonth]}&nbsp;&nbsp;${startingYear}</strong></font></td><td><font size="4"><strong>Month II <br>${monthNames[endingMonth]}&nbsp;&nbsp;${endingYear}</strong></font></td>`;
    else
        htmlToSend += `<td><font size="4"><strong>Month I <br>${monthNames[startingMonth]}&nbsp;&nbsp;${startingYear}</strong></font></td><td><font size="4"><strong>Month II <br>${monthNames[midMonth]}&nbsp;&nbsp;${midYear}</strong></font></td><td><font size="4"><strong>Month III <br>${monthNames[endingMonth]}&nbsp;&nbsp;${endingYear}</strong></font></td><td><font size="4"><strong>Balance At End<br>Of ${monthNames[endingMonth]}&nbsp;&nbsp;${endingYear}</strong></font></td>`;

    htmlToSend += `<td><font size="4"><strong>Bal.<br>Stock</td>`;

    if (diff == 3)
        htmlToSend += `<td><font size="4"><strong>Qty.<br>Req.</strong></font></td> <td style="width: 20px;"><font size="4"><strong>Final<br>Req.</strong></font></td>`;

    htmlToSend += `<td><font size="4"><strong>Remark</strong></font></td></tr></thead><tbody>`;

    db.find({
        name: item_name
    }, function(err, docs) {
        if (err) {
            res.send("error");
        } 
        else if (docs.length == 1) {
              let counterArray = [0, 0, 0];
              htmlToSend += `<tr class="warning"><td>1</td><td>${docs[0].name}</td><td>${docs[0].make[0]}</td><td>${docs[0].group}</td><td>${docs[0].unit}</td>`;

                let lenDate = docs[0].date.length;
                let currBalanceLastMonth = 0;
                for (let j = 0; j < lenDate; j++) {
                    let currentDate = new Date(parseInt(docs[0].date[j].substring(docs[0].date[j].lastIndexOf('-') + 1)), parseInt(docs[0].date[j].substring(docs[0].date[j].indexOf('-') + 1, docs[0].date[j].lastIndexOf('-'))) - 1, parseInt(docs[0].date[j].substring(0, docs[0].date[j].indexOf('-'))));
                    if (diff >= 1)
                        if (currentDate >= firstDayStarting && currentDate <= firstDayEnding)
                            counterArray[0] += parseFloat(docs[0].items_given_to_staff[j]);
                    if (diff >= 2)
                        if (currentDate >= midDayStarting && currentDate <= midDayEnding)
                            counterArray[1] += parseFloat(docs[0].items_given_to_staff[j]);
                    if (diff == 3) {
                        if(currentDate <= lastDayEnding)
                        {
                                currBalanceLastMonth -= parseFloat(docs[0].items_given_to_staff[j]);
                                currBalanceLastMonth += parseFloat(docs[0].items_added_to_Stock[j]);      
                        }
                        if (currentDate >= lastDayStarting && currentDate <= lastDayEnding)
                            counterArray[2] += parseFloat(docs[0].items_given_to_staff[j]);
                        }
                }
                counterArray[0] = Math.round(counterArray[0]*100)/100;
                counterArray[1] = Math.round(counterArray[1]*100)/100;
                counterArray[2] = Math.round(counterArray[2]*100)/100;

                if (diff >= 1)
                    htmlToSend += `<td>${counterArray[0]}</td>`;
                if (diff >= 2)
                    htmlToSend += `<td>${counterArray[1]}</td>`;
                if (diff == 3)
                    htmlToSend += `<td>${counterArray[2]}</td><td>${Math.round(currBalanceLastMonth*100)/100}</td>`;

                htmlToSend += `<td>${Math.round(docs[0].balance*100)/100}</td>`;

                if (diff == 3)
                    htmlToSend += `<td>${Math.round((parseFloat((counterArray[0] + counterArray[1] + counterArray[2]) / 2) - parseFloat(currBalanceLastMonth))*100)/100}</td><td style="width: 20px;"></td>`;

                htmlToSend += `<td></td></tr>
                </tbody>
                </table>
            <div class="container container-table" style="margin-top:-5%;">
              <div class="row vertical-center-row">
                  <div class="text-center col-md-2 col-md-offset-4" style="background:lavenderblush">
                      <strong><i>****End Of Report****</i></strong>
                  </div>
              </div>
          </div>`;
          res.send(htmlToSend);     
        }
        else
                res.send('<br><br><br><br><h4 style="color:red;text-align:center;" >No Items Found.</h4>');
        });
});

router.get('/generateReportIssueReceive', function(req, res, next) {
    //log.info("get request for generateReportIssueReceive");
    db.find({

    }).sort({
        name: 1
    }).exec(function(err, docs) {
        if (err) {
            //log.info("Error happened while /generateReportIssueReceive : " + err);
            res.send("error");
        } else {
            if (docs.length > 0) {
                let htmlToSend = `
      <table class="table table-bordered table-striped table-condensed table-responsive">
      <thead>
        <tr id="head">
          <td>Issued Items Between The Time Span</td>
          <td>Received Items Into Stock Between The Time Span(including opening balance)</td>
        </tr>
      </thead>
      <tbody>
      <tr class="warning">
        <td>
        <table class="table table-bordered table-striped table-condensed table-responsive">
        <thead>
        <tr>
        <td style="color:green;">S No.</td>
        <td style="color:green;">Item Name</td>
        <td style="color:green;">Total Qty. Issued</td>
        </tr>
        </thead>
        <tbody>
        `;

                let htmlToSendIssued = `` , htmlToSendReceived = ``;
                let counterIssue = 1 , counterReceive = 1;
                let sumIssue = 0, sumReceive = 0;
                let totalsumIssue = 0, totalsumReceive = 0;
                for (let i = 0; i < docs.length; i++) {
                    sumIssue = 0;
                    sumReceive = 0;
                    for (let j = 0; j < docs[i].date.length; j++) {
                        if (utilityFunctions.checkDate(docs[i].date[j], req.query.startingDate, req.query.endingDate)) {
                            if (docs[i].items_given_to_staff[j] != 0)
                                sumIssue += docs[i].items_given_to_staff[j];
                            if (docs[i].items_added_to_Stock[j] != 0)
                                sumReceive += docs[i].items_added_to_Stock[j];
                        }
                    }
                    if (sumIssue != 0) {
                        htmlToSendIssued += `<tr><td>${counterIssue}</td><td>${docs[i].name}</td><td>${sumIssue}</td></tr>`;
                        counterIssue++;
                    }

                    if (sumReceive != 0) {
                        htmlToSendReceived += `<tr><td>${counterReceive}</td><td>${docs[i].name}</td><td>${sumReceive}</td></tr>`;
                        counterReceive++;
                    }
                    totalsumIssue += sumIssue;
                    totalsumReceive += sumReceive;
                }
                htmlToSend += `${htmlToSendIssued}
                <tr>
                <td></td>
                <td style='background-color:#6666ff;color:white;'>GRAND TOTAL</td>
                <td>${totalsumIssue}</td>
                </tr>
                </tbody></table></td>
       <td>
       <table class="table table-bordered table-striped table-condensed table-responsive">
       <thead>
       <tr>
       <td style="color:green;">S No.</td>
       <td style="color:green;">Item Name</td>
       <td style="color:green;">Total Qty. Received</td>
       </tr>
       </thead>
       <tbody>
       ${htmlToSendReceived}
       <tr>
        <td></td>
        <td style='background-color:#6666ff;color:white;'>GRAND TOTAL</td>
        <td>${totalsumReceive}</td>
        </tr>
       </table></td>
       </tr>
       </tbody>
       </table>
       `;
                //log.info(htmlToSend);
                res.send(htmlToSend);
            } else
                res.send(`
                <table class="table table-bordered table-striped table-condensed table-responsive">
                <thead>
                  <tr id="head">
                    <td>Issued Items Between The Time Span</td>
                    <td>Received Items Into Stock Between The Time Span(including opening balance)</td>
                  </tr>
                </thead>
                <tbody>
                <tr class="success"><td></td><td></td></tr>
                </tbody>
                </table>
                `);
        }

    });

});


module.exports = router;