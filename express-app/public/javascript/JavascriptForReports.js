/*  UTILITY FUNCTIONS */
// FUNCTION TO CALUCLATE THE NO OF MONTHS THE REPORT NEEDS TO BE MAD3
function monthDiff(date1, date2) {
    var year1 = date1.getFullYear();
    var year2 = date2.getFullYear();
    var month1 = date1.getMonth();
    var month2 = date2.getMonth();
    if (month1 === 0) {
        month1++;
        month2++;
    }
    return numberOfMonths = (year2 - year1) * 12 + (month2 - month1) + 1;
}

function exportTableToCSV($table, filename) {
    var $rows = $table.find('tr:has(td)'), // Temporary delimiter characters unlikely to be typed by keyboard
        // This is to avoid accidentally splitting the actual contents
        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0), // null character
        // actual delimiter characters for CSV format
        colDelim = '","'
        , rowDelim = '"\r\n"', // Grab text from table into CSV formatted string
        csv = '"' + $rows.map(function (i, row) {
            var $row = $(row)
                , $cols = $row.find('td');
            return $cols.map(function (j, col) {
                    var $col = $(col)
                        , text = $col.text();
                    return text.replace(/"/g, '""'); // escape double quotes
                })
                .get()
                .join(tmpColDelim);
        })
        .get()
        .join(tmpRowDelim)
        .split(tmpRowDelim)
        .join(rowDelim)
        .split(tmpColDelim)
        .join(colDelim) + '"';
    // Deliberate 'false', see comment below
    if (false && window.navigator.msSaveBlob) {
        var blob = new Blob([decodeURIComponent(csv)], {
            type: 'text/csv;charset=utf8'
        });
        // Crashes in IE 10, IE 11 and Microsoft Edge
        // See MS Edge Issue #10396033: https://goo.gl/AEiSjJ
        // Hence, the deliberate 'false'
        // This is here just for completeness
        // Remove the 'false' at your own risk
        window.navigator.msSaveBlob(blob, filename);
    } else if (window.Blob && window.URL) {
        // HTML5 Blob        
        var blob = new Blob([csv], {
            type: 'text/csv;charset=utf8'
        });
        var csvUrl = URL.createObjectURL(blob);
        $(this)
            .attr({
                'download': filename
                , 'href': csvUrl
            });
    } else {
        // Data URI
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
        $(this)
            .attr({
                'download': filename
                , 'href': csvData
                , 'target': '_blank'
            });
    }
}
// FUNCTION TO MAKE FULL REPORT 
function makeFullReport(includeItemWithNoActivity) {
    let oldstarting = $("#startingDate1").val();
    let oldending = $("#endingDate1").val();
    let withoutNegative = $('#withoutNegative').is(':checked');
    if (!oldstarting || !oldending) {
        $("#errorMessages").html("<h4 style='color:red;text-align:center;'> Enter The Month Span For Which The Report Is Needed</h4>");
    }
    else {
        let starting = new Date(oldstarting);
        let ending = new Date(oldending);

        if(!starting || !ending) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'> Invalid Month Span </h4>");
            return;
        }
        
        let diff = monthDiff(starting, ending);

        if (diff < 1) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Check Your Date.<br>Ending Month Is Less Than Starting Month.</h4>");
        } 
        else if (diff > 3) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Range Of Month Should No Be More Than 3 Months</h4>");
        }
        else {
            let inputToSendViaAjaxPost = `withoutNegative=${(withoutNegative?1:0)}&includeItemWithNoActivity=${includeItemWithNoActivity}&diff=${diff}&startingMonth=${starting.getMonth()}
            &startingYear=${starting.getFullYear()}&endingMonth=${ending.getMonth()}&endingYear=${ending.getFullYear()}`;

            $.ajax({
                type: "GET"
                , url: "/viewDetails/viewFullReport"
                , data: inputToSendViaAjaxPost
                , success: function (result, status, xhr) {
                    $("#loader").fadeOut(150);
                    
                    if (result == "error") {
                        $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Some Error Occured While Fetching The Data</h4>");
                    }
                    else {
                        $("#errorMessages").html("");
                        $("#result").html(result);
                        $("#question").html(`
<div class="container-fluid">
    <div class="row">
        <table class="table table-condensed table-bordered" style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Starting month</th>
                    <th>Ending month</th>
            </thead>
            <tbody>
                <tr class="success">
                    <td><input id="startingDate1" class="form-control dateOfEntry" name="startingDate1" value="${oldstarting}" type="month" required></td>
                    <td><input id="endingDate1" class="form-control dateOfEntry" name="endingDate1" value="${oldending}" type="month" required></td>
                </tr>

                <tr class="success">
                    <td><button id="getFullReportButtonWithZeroes" type="submit" class="btn btn-default btn-xs btn-block" style="color:black;">INCLUDE EVERY ITEM IN REPORT</button></td>
                    <td><button id="getFullReportButtonWithoutZeroes" type="submit" class="btn btn-warning btn-xs btn-block" style="color:black;">REMOVE ITEMS WITH NO ACTIVITY IN ALL THE PROVIDED MONTHS</button></td>
                    <td><button id="getFullReportButtonWithoutLastZeroes" type="submit" class="btn btn-info btn-xs btn-block" style="color:black;">REMOVE ITEMS WITH NO ACTIVITY IN THE LAST MONTH</button></td>
                    <td>
                        <label><input type="checkbox" id="withoutNegative" checked>&nbsp;INCLUDE ITEMS WITH NEGATIVE "Qty. REQUIRED" </label>
                    </td>
                </tr>


                <tr>
                    <a href="#" class="btn btn-success btn-sm btn-block export" style="color:black;font-size: 15px;">
      EXPORT DATA AS EXCEL SHEET
      <br>
      <strong style="color: blue;" >*WHILE SAVING THE FILE DO NOT REMOVE THE .CSV AT THE END OF THE FILE NAME</strong></a>
                </tr>
            </tbody>
        </table>
    </div>
</div>`);
                $('#withoutNegative').prop('checked', withoutNegative);
                    }
                }
                , error: function (xhr, status, error) {
                    $("#loader").fadeOut(150);
                    $("#errorMessages").html("<h2><h4 style='color:red;text-align:center;'>Some Error Occured While Fetching The Data ${error}</h4>");
                }
            });
            $("#loader").fadeIn(150);
        }
    }
}
// FUNCTION TO MAKE GROUP REPORT 
function makeFullGroupReport(includeItemWithNoActivity) {
    let oldstarting = $("#startingDate2").val();
    let oldending = $("#endingDate2").val();
    let group = $("#group").val();
    let withoutNegative = $('#withoutNegativeGroup').is(':checked');

    if (!oldstarting || !oldending ) {
        $("#errorMessages").html("<h4 style='color:red;text-align:center;'> Enter The Month Span For Which The Report Is Needed</h4>");
    }
    else if (!group) {
        $("#errorMessages").html("<h4 style='color:red;text-align:center;'> The Group Name In The Report Is Needed</h4>");
    }
    else if (checkIfExistsGroup(group) != 2) {
        $("#errorMessages").html("<h4 style='color:red;text-align:center;'> The Group Name Does Not Exist.</h4>");
    }
    else {
        let starting = new Date(oldstarting);
        let ending = new Date(oldending);

        if(!starting || !ending) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'> Invalid Month Span </h4>");
            return;
        }

        let diff = monthDiff(starting, ending);
        
        if (diff < 1) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Check Your Date.<br>Ending Month Is Less Than Starting Month.</h4>");
        } 
        else if (diff > 3) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Range Of Month Should No Be More Than 3 Months</h4>");
        }
        else {
            let inputToSendViaAjaxPost = `withoutNegative=${(withoutNegative?1:0)}&includeItemWithNoActivity=${includeItemWithNoActivity}&diff=${diff}&startingMonth=${starting.getMonth()}
                &startingYear=${starting.getFullYear()}&endingMonth=${ending.getMonth()}&endingYear=${ending.getFullYear()}
                &group=${encodeURIComponent(group.toLowerCase().trim().replace(/\s\s+/g, ' '))}`;
            $.ajax({
                type: "GET"
                , url: "/viewDetails/viewFullReport"
                , data: inputToSendViaAjaxPost
                , success: function (result, status, xhr) {
                    $("#loader").fadeOut(150);
                    if (result == "error") 
                        $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Some Error Occured While Fetching The Data</h4>");
                    else {
                        $("#errorMessages").html("");
                        $("#result").html(result);
                        $("#question").html(`
<div class="container-fluid">
    <div class="row">
        <table class="table table-condensed table-bordered" style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Starting month</th>
                    <th>Ending month</th>
                    <th>Group</th>
            </thead>
            <tbody>
                <tr class="danger">
                    <td><input id="startingDate2" class="form-control dateOfEntry" name="startingDate2" value="${oldstarting}" type="month" required></td>
                    <td><input id="endingDate2" class="form-control dateOfEntry" name="endingDate2" value="${oldending}" type="month" required></td>
                    <td><input id="group" class="form-control group" name="group" type="text" value="${group}" required></td>
                </tr>

                <tr class="success">
                    <td><button id="specificGroupButtonWithZeroes" type="submit" class="btn btn-default btn-xs btn-block" style="color:black;">INCLUDE EVERY ITEM IN REPORT</button></td>
                    <td><button id="specificGroupButtonWithoutZeroes" type="submit" class="btn btn-warning btn-xs btn-block" style="color:black;">REMOVE ITEMS WITH NO ACTIVITY IN ALL THE PROVIDED MONTHS</button></td>
                    <td><button id="specificGroupButtonWithoutLastZeroes" type="submit" class="btn btn-info btn-xs btn-block" style="color:black;">REMOVE ITEMS WITH NO ACTIVITY IN THE LAST MONTH</button></td>
                    <td>
                        <label><input type="checkbox" id="withoutNegativeGroup" checked>&nbsp;INCLUDE ITEMS WITH NEGATIVE "Qty. REQUIRED" </label>
                    </td>
                </tr>
                <tr>
                    <a href="#" class="btn btn-success btn-sm btn-block export" style="color:black;font-size: 15px;">
      EXPORT DATA AS EXCEL SHEET
      <br>
      <strong style="color: blue;" >*WHILE SAVING THE FILE DO NOT REMOVE THE .CSV AT THE END OF THE FILE NAME</strong></a>
                </tr>

            </tbody>
        </table>
    </div>
</div>`);
                $('#withoutNegativeGroup').prop('checked', withoutNegative);

                        dataListForGroup();
                    }
                }
                , error: function (xhr, status, error) {
                    $("#loader").fadeOut(150);
                    $("#errorMessages").html("<h2><h4 style='color:red;text-align:center;'>Some Error Occured While Fetching The Data</h4>");
                }
            });
            $("#loader").fadeIn(150);
        }
    }
}

// FUNCTION TO MAKE ITEM NAME REPORT 
function makeItemNameReport() {
    let oldstarting = $("#startingDate3").val();
    let oldending = $("#endingDate3").val();
    let item_name = $("#item_name").val();

    if (!oldstarting || !oldending ) {
        $("#errorMessages").html("<h4 style='color:red;text-align:center;'> Enter The Month Span For Which The Report Is Needed</h4>");
    }
    else if (!item_name) {
        $("#errorMessages").html("<h4 style='color:red;text-align:center;'> The Item Name In The Report Is Needed</h4>");
    }
    else if (checkIfExists(item_name) != 2) {
        $("#errorMessages").html("<h4 style='color:red;text-align:center;'> The Item Name Does Not Exist.</h4>");
    }
    else {
        let starting = new Date(oldstarting);
        let ending = new Date(oldending);

        if(!starting || !ending) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'> Invalid Month Span </h4>");
            return;
        }

        let diff = monthDiff(starting, ending);
        
        if (diff < 1) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Check Your Date.<br>Ending Month Is Less Than Starting Month.</h4>");
        } 
        else if (diff > 3) {
            $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Range Of Month Should No Be More Than 3 Months</h4>");
        }
        else {
            let inputToSendViaAjaxPost = `diff=${diff}&startingMonth=${starting.getMonth()}
                &startingYear=${starting.getFullYear()}&endingMonth=${ending.getMonth()}&endingYear=${ending.getFullYear()}
                &item_name=${encodeURIComponent(item_name.toLowerCase().trim().replace(/\s\s+/g, ' '))}`;
            $.ajax({
                type: "GET"
                , url: "/viewDetails/viewReportOfOneItem"
                , data: inputToSendViaAjaxPost
                , success: function (result, status, xhr) {
                    $("#loader").fadeOut(150);
                    if (result == "error") 
                        $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Some Error Occured While Fetching The Data</h4>");
                    else {
                        $("#errorMessages").html("");
                        $("#result").html(result);
                        $("#question").html(`
<div class="container-fluid">
    <div class="row">
        <table class="table table-condensed table-bordered" style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Starting month</th>
                    <th>Ending month</th>
                    <th>Item Name</th>
                    <th>Submit Button</th>
            </thead>
            <tbody>
                <tr class="danger">
                    <td><input id="startingDate3" class="form-control dateOfEntry" name="startingDate3" value="${oldstarting}" type="month" required></td>
                    <td><input id="endingDate3" class="form-control dateOfEntry" name="endingDate3" value="${oldending}" type="month" required></td>
                    <td><input id="item_name" class="form-control item_name" name="item_name" value="${item_name}" type="text" required></td>
                    <td><button id="specificNameButton" type="submit" class="btn btn-warning btn-lg btn-block" style="color:black;">VIEW REPORT</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`);
                        dataListForName();
                    }
                }
                , error: function (xhr, status, error) {
                    $("#loader").fadeOut(150);
                    $("#errorMessages").html("<h2><h4 style='color:red;text-align:center;'>Some Error Occured While Fetching The Data</h4>");
                }
            });
            $("#loader").fadeIn(150);
        }
    }
}

$(function () {
    $(".nav.navbar-nav li:eq(5)").attr("class", "active");
    
    $("#print").click(function () {
            window.print();
        })
        /*--------------------- MATTER FUNCTIONS --------------------------------*/
    
    $("body").on("click", "#getFullReport", function () {
            $("#question").html(`
<div class="container-fluid">
    <div class="row">
        <table class="table table-condensed table-bordered" style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Starting month</th>
                    <th>Ending month</th>
            </thead>
            <tbody>
                <tr class="success">
                    <td><input id="startingDate1" class="form-control dateOfEntry" name="startingDate1" type="month" required></td>
                    <td><input id="endingDate1" class="form-control dateOfEntry" name="endingDate1" type="month" required></td>
                </tr>

                <tr class="success">
                    <td><button id="getFullReportButtonWithZeroes" type="submit" class="btn btn-default btn-xs btn-block" style="color:black;">INCLUDE EVERY ITEM IN REPORT</button></td>
                    <td><button id="getFullReportButtonWithoutZeroes" type="submit" class="btn btn-warning btn-xs btn-block" style="color:black;">REMOVE ITEMS WITH NO ACTIVITY IN ALL THE PROVIDED MONTHS</button></td>
                    <td><button id="getFullReportButtonWithoutLastZeroes" type="submit" class="btn btn-info btn-xs btn-block" style="color:black;">REMOVE ITEMS WITH NO ACTIVITY IN THE LAST MONTH</button></td>
                    <td>
                        <label><input type="checkbox" id="withoutNegative" checked>&nbsp;INCLUDE ITEMS WITH NEGATIVE "Qty. REQUIRED" </label>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
</div>`);
        });

    $("body").on("click", "#specificGroup", function () {
            $("#question").html(`
<div class="container-fluid">
    <div class="row">
        <table class="table table-condensed table-bordered" style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Starting month</th>
                    <th>Ending month</th>
                    <th>Group</th>
            </thead>
            <tbody>
                <tr class="danger">
                    <td><input id="startingDate2" class="form-control dateOfEntry" name="startingDate2" type="month" required></td>
                    <td><input id="endingDate2" class="form-control dateOfEntry" name="endingDate2" type="month" required></td>
                    <td><input id="group" class="form-control group" name="group" type="text" required></td>
                </tr>

                <tr class="success">
                    <td><button id="specificGroupButtonWithZeroes" type="submit" class="btn btn-default btn-xs btn-block" style="color:black;">INCLUDE EVERY ITEM IN REPORT</button></td>
                    <td><button id="specificGroupButtonWithoutZeroes" type="submit" class="btn btn-warning btn-xs btn-block" style="color:black;">REMOVE ITEMS WITH NO ACTIVITY IN ALL THE PROVIDED MONTHS</button></td>
                    <td><button id="specificGroupButtonWithoutLastZeroes" type="submit" class="btn btn-info btn-xs btn-block" style="color:black;">REMOVE ITEMS WITH NO ACTIVITY IN THE LAST MONTH</button></td>
                    <td>
                        <label><input type="checkbox" id="withoutNegativeGroup" checked>&nbsp;INCLUDE ITEMS WITH NEGATIVE "Qty. REQUIRED" </label>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`);
            dataListForGroup();
        });

    $("body").on("click", "#specificName", function () {
            $("#question").html(`
<div class="container-fluid">
    <div class="row">
        <table class="table table-condensed table-bordered" style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Starting month</th>
                    <th>Ending month</th>
                    <th>Item Name</th>
                    <th>Submit Button</th>
            </thead>
            <tbody>
                <tr class="danger">
                    <td><input id="startingDate3" class="form-control dateOfEntry" name="startingDate3" type="month" required></td>
                    <td><input id="endingDate3" class="form-control dateOfEntry" name="endingDate3" type="month" required></td>
                    <td><input id="item_name" class="form-control item_name" name="item_name" type="text" required></td>
                    <td><button id="specificNameButton" type="submit" class="btn btn-warning btn-lg btn-block" style="color:black;">VIEW REPORT</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`);
            dataListForName();
        });

    $("body").on("click", "#listSpan", function () {
            $("#question").html(`
<div class="container-fluid">
    <div class="row">
        <table class="table table-condensed table-bordered" style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Starting date</th>
                    <th>Ending date</th>
                    <th>Submit Button</th>
            </thead>
            <tbody>
                <tr class="warning">
                    <td><input id="startingDate3" class="form-control dateOfEntry" name="startingDate3" type="text" required></td>
                    <td><input id="endingDate3" class="form-control dateOfEntry" name="endingDate3" type="text" required></td>
                    <td><button id="listSpanButton" type="submit" class="btn btn-warning btn-lg btn-block">GENERATE LIST</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`);
            $(".dateOfEntry")
                .datepicker({
                    dateFormat: 'dd-mm-yy'
                });
        });
    /*--------------------- EVENT HANDLER FUNCTIONS --------------------------------*/
    $("body").on("click", ".export", function () {
            var args = [$('#result>table'), 'report.csv.csv'];
            exportTableToCSV.apply(this, args);
        });

    $("body").on("click", "#getFullReportButtonWithZeroes", function () {
            makeFullReport(0);
        });
    $("body").on("click", "#getFullReportButtonWithoutZeroes", function () {
            makeFullReport(1);
        });
    $("body").on("click", "#getFullReportButtonWithoutLastZeroes", function () {
            makeFullReport(2);
        });

    $("body").on("click", "#specificGroupButtonWithZeroes", function () {
            makeFullGroupReport(0);
        });
    $("body").on("click", "#specificGroupButtonWithoutZeroes", function () {
            makeFullGroupReport(1);
        });
    $("body").on("click", "#specificGroupButtonWithoutLastZeroes", function () {
            makeFullGroupReport(2);
        });

    $("body").on("click", "#specificNameButton", function () {
            makeItemNameReport();
        });

    $("body").on("click", "#listSpanButton", function () {
            let starting = $("#startingDate3").val();
            let ending = $("#endingDate3").val();
            if (!starting || !ending)
                $("#errorMessages").html("<h4 style='color:red;text-align:center;'> Enter The Time Span For Which The Report Is Needed</h4>");
            else {
                startingDate = new Date(starting);
                endingDate = new Date(ending);
                if(!starting || !ending)
                {
                    $("#errorMessages").html("<h4 style='color:red;text-align:center;'> Invalid Month Span </h4>");
                    return;
                }
                if (startingDate > endingDate) {
                    $("#errorMessages").html("<h4 style='color:red;text-align:center;'>Check Your Date.<br>Ending Date Is Less Than Starting Date</h4>");
                } else {
                    let inputToSendViaAjaxPost = "startingDate=" + starting.toLowerCase() + "&endingDate=" + ending.toLowerCase();
                    $.ajax({
                        type: "GET"
                        , url: "/viewDetails/generateReportIssueReceive"
                        , data: inputToSendViaAjaxPost
                        , success: function (result, status, xhr) {
                            $("#loader").fadeOut(150);

                            if (result == "error") {
                                $("#result").html("<h2 style='color:red;text-align:center;'>Some Error Occured While Fetching The Data</h2>");
                            }
                            else {
                                $("#result").html(result);
                            }
                        }
                        , error: function (xhr, status, error) {
                            $("#loader").fadeOut(150);
                            $("#result").html("<h2 style='color:red;text-align:center;'>Some Error Occured While Fetching The Data</h2>");
                        }
                    });
                    $("#loader").fadeIn(150);
                }
            }
        });
});