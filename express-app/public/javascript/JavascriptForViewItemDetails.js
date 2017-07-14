$(function () {
    $(".nav.navbar-nav li:eq(4)").attr("class", "active");
    $("#print").click(function () {
            window.print();
        })

    dataListForName();
    //Entering the date
    $('body').on('focus', '#startingDate1', function () {
            $(".dateOfEntry")
                .datepicker({
                    dateFormat: 'dd-mm-yy'
                });
        });

    $('body').on('focus', '#endingDate1', function () {
            $(".dateOfEntry")
                .datepicker({
                    dateFormat: 'dd-mm-yy'
                });
        });

    function checkDate(date) {
        return ((date)?true:false);
    }

    /*
    Event Handlers for Finding Balance Of 1 Item
     */

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
    $("#viewBalanceOf1ItemButton").click(function () {
            $("#question").html(`
<div class="container-fluid">
    <span id="viewBalanceOf1ItemSpan" class="row">
        <table class="table table-condensed table-bordered"  style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Submit Button</th>
                </tr>
            </thead>
            
            <tbody>
                <tr class="success">
                    <td>
                        <input type="text" id="searchItem1" class="form-control" name="searchItem1" placeholder="Enter item name" size="50" list="searchResultsForName" autocomplete="off">
                    </td>
                    <td>
                        <button id="submitBalanceOf1ItemButton" class="btn btn-warning btn-lg btn-block">SEARCH</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </span>
</div>`);
            dataListForName();
            $("#searchItem1").focus();
        });

    $("#viewDetailsOf1ItemButton").click(function () {
            $("#question").html(`
<div class="container-fluid">
    <span id="viewDetailsOf1ItemSpan" class="row">
        <table class="table table-condensed table-bordered"  style="margin-top:0%;">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Starting Date</th>
                    <th>Ending Date</th>
                    <th>Submit Button</th>
                </tr>
            </thead> 
            <tbody>
            <tr>
                    <a href="#" class="btn btn-success btn-sm btn-block export" style="color:black;font-size: 15px;">
                        EXPORT DATA AS EXCEL SHEET
                        <br>
                        <strong style="color: blue;" >*WHILE SAVING THE FILE DO NOT REMOVE THE .CSV AT THE END OF THE FILE NAME</strong>
                    </a>
            </tr>
                <tr class="success">
                    <td>
                        <input type="text" id="searchItem2" class="form-control" name="searchItem2" placeholder="Enter item name" size="50" list="searchResultsForName" autocomplete="off">
                    </td>
                    <td>
                        <input id="startingDate1" class="form-control dateOfEntry" name="startingDate1" type="text" required>
                    </td>
                    <td>
                        <input id="endingDate1" class="form-control dateOfEntry" name="endingDate1" type="text" required>
                    </td>
                    <td>
                        <button id="submitDetailsOf1ItemButton" class="btn btn-warning btn-lg btn-block" >SEARCH</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </span>
</div>`);
            dataListForName();
            $("#searchItem2").focus();
        });

    function ResultBalance() {
        var data = $("#searchItem1").val();
        if (data) {
            var inputToSendViaAjaxPost = "data=" + encodeURIComponent(data.toLowerCase().trim().replace(/\s\s+/g, ' '));
            $.ajax({
                type: "GET",
                url: "/viewDetails/viewBalanceOf1Item",
                data: inputToSendViaAjaxPost,
                success: function (result, status, xhr) {
                    $("#loader").fadeOut(150);

                    if (result == "error")
                        $("#result").html("Some Error Occured While Fetching The Data");
                    else if (result == "doesNotexist")
                        $("#result").html("<h2>Item not found</h2>");
                    else if (result == "2NameExist")
                        $("#result").html("Error As More Than 1 Item With Same Name Exist");
                    else
                        $("#result").html(result);
                },
                error: function (xhr, status, error) {
                    $("#loader").fadeOut(150);
                    $("#result").html("Error Occured");
                }
            })
            $("#loader").fadeIn(150);
        }
    }

    function ResultDetails() {
        var data = $("#searchItem2").val();
        var startingDate = $("#startingDate1").val();
        var endingDate = $("#endingDate1").val();
        if (data && checkDate(startingDate) && checkDate(endingDate)) {
            var inputToSendViaAjaxPost = "data=" + encodeURIComponent(data.toLowerCase().trim().replace(/\s\s+/g, ' ')) + "&startingDate=" + encodeURIComponent(startingDate.toLowerCase().trim().replace(/\s\s+/g, ' ')) + "&endingDate=" + encodeURIComponent(endingDate.toLowerCase().trim().replace(/\s\s+/g, ' '));
            $.ajax({
                type: "GET",
                url: "/viewDetails/viewDetailsOf1Item",
                data: inputToSendViaAjaxPost,
                success: function (result, status, xhr) {
                    $("#loader").fadeOut(150);
                    if (result == "error")
                        $("#result").html("<h2>Some Error Occured While Fetching The Data</h2>");
                    else if (result == "doesNotexist")
                        $("#result").html("<h2>Item not found</h2>");
                    else if (result == "2NameExist")
                        $("#result").html("Error As More Than 1 Item With Same Name Exist");
                    else
                        $("#result").html(result);
                },
                error: function (xhr, status, error) {
                    $("#loader").fadeOut(150);
                    $("#result").html("Error Occured");
                }
            })
            $("#loader").fadeIn(150);
        }
    }

    $("body").on("click", ".export", function () {
            var args = [$('#result>table'), 'report.csv.csv'];
            exportTableToCSV.apply(this, args);
        });

    $('body').on('click', '#submitBalanceOf1ItemButton', function () {
            ResultBalance();
        });

    $('body').on('keydown', '#searchItem1', function (e) {
            var key = e.which;
            if (key == 13) {
                ResultBalance();
            }
        });


    $('body').on('click', '#submitDetailsOf1ItemButton', function () {
            ResultDetails();
        });

    $('body').on('keydown', '#searchItem2', function (e) {
            var key = e.which;
            if (key == 13) {
                $("#startingDate1").focus();
            }
        });

});
