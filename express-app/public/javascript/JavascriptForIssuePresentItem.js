var keepATrackOfInputsInForm = 1;
var flagForSubmittingForm = 0;
var maximumElements = 5;
$(document)
    .ready(function () {
        $(".nav.navbar-nav li:eq(2)").attr("class", "active");
        $("#reload").click(function () {
                location.reload(false);
            });
        $("#print").click(function () {
                window.print();
            })
        dataListForName();
        dataListForWhom();
        dataListForPurpose();
        todaysDate();
        $(".dateOfEntry").datepicker({
                dateFormat: 'dd-mm-yy'
            });
        $("#row1 td input:eq(1)").focus();


        $("#reload").click(function () {
                location.reload(false);
            });

        $(document).on("focusout", ".dateOfEntry", function () {
                let dateOfEntrylocal = $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").val();
                if (checkDate(dateOfEntrylocal)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter the date");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").focus();
                } else {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(2)").focus();
                }
            });

        $(document).on("keydown", ".dateOfEntry", function (e) {
                if (e.which == 13) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(2)").focus();
                }
            });

        $(document).on("keydown", ".item_name", function (e) {
                if (e.which == 13) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(3)").focus();
                }

            });

        $(document).on("focusout", ".item_name", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(2)").val();
                let check = checkIfExists(item);
                if (checkItem(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter the item name");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(2)").focus();
                } else if (check == 1) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Some Error Occured while Checking.");
                } else if (check == 3) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("The Item Does Not Exist.<br>Can't be Issued.<br>If You want to Add it , <br>Click the 'Add New Item Into Ledger'<br>Button On top</a>");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(2)").focus();

                } else if (check == 2) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
                    let check2 = getUnitAndCurrentBalance(item);
                    if (check2 == 1)
                        $("#row" + keepATrackOfInputsInForm + " td cite").html("Some Error Occured while Finding unit.");
                    else
                        $("#row" + keepATrackOfInputsInForm + " td cite").html("");
                } else
                    $("#row" + keepATrackOfInputsInForm + " td cite")
                    .html("error");
            });


        $(document).on("focusout", ".quantity", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(3)").val();
                if (checkNumber(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter the balance correctly");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(3)").focus();
                } else if (parseFloat(item) > parseFloat($("#row" + keepATrackOfInputsInForm + " td #current").html())) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("There are not enough items <br>to issue the given items.");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(2)").focus();
                } else
                    $("#row" + keepATrackOfInputsInForm + " td cite")
                    .html("");
            })

        $(document).on("keydown", ".quantity", function (e) {
                var key = e.which;
                if (key == 13 || key == 9) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(4)").focus();
                }
            });

        $(document).on("keydown", ".whom", function (e) {
                if (e.which == 13) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(5)").focus();
                }
            });

        $(document).on("focusout", ".whom", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(4)").val();
                if (checkWhom(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter Whom To Issued.");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(4)").focus();
                } else
                    $("#row" + keepATrackOfInputsInForm + " td cite")
                    .html("");
            });


        $(document).on("keydown", ".purpose", function (e) {
                if (e.which == 13) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(5)").focusout();
                }
            });

        $(document).on("focusout", ".purpose", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(5)").val();
                if (checkPurpose(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter Purpose Of Issue.");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(5)").focus();
                } else {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
                    $("#row" + keepATrackOfInputsInForm + " td button").fadeIn("slow");
                }
            });


        function sendAjax(data) {
            if (data) {
                var rowId = "#row" + data;
                var inputToSendViaAjaxPost = `date=` + encodeURIComponent($(rowId + " td input:eq(1)").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                     + `&names=` + encodeURIComponent($(rowId + " td input:eq(2)").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                     + `&issue=` + encodeURIComponent($(rowId + " td input:eq(3)").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                     + `&whom=` + encodeURIComponent($(rowId + " td input:eq(4)").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                     + `&purpose=` + encodeURIComponent($(rowId + " td input:eq(5)").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
                $.ajax({
                    type: "POST",
                    url: "/stockHandler/IssueItemToStaffDatabase",
                    data: inputToSendViaAjaxPost,
                    success: function (result, status, xhr) {
                        $("#loader")
                            .fadeOut(150);
                        if (result.startsWith("error")) {
                            $(rowId + " td cite").html("&nbsp;&nbsp;Could Not Be Added. Reason : " + result.substring(5));
                            $(rowId + " td cite").html("class", "glyphicon glyphicon-thumbs-down");
                            $(rowId).attr("class", "danger");
                            $(rowId + " td input").prop("disabled", true);
                            $(rowId + " td button").fadeOut("slow");
                            keepATrackOfInputsInForm++;
                            $("#row" + keepATrackOfInputsInForm).fadeIn("slow");
                            $("#row" + keepATrackOfInputsInForm + " td input:eq(0)").val(keepATrackOfInputsInForm);
                            if (keepATrackOfInputsInForm > 1)
                                $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").val($("#row" + (keepATrackOfInputsInForm - 1) + " td input:eq(1)").val());
                            $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").focus();

                        } else if (result == "success") {
                            $(rowId + " td cite").html("");
                            $(rowId + " td cite").attr("class", "glyphicon glyphicon-thumbs-up");
                            $(rowId).attr("class", "success");
                            $(rowId + " td input").prop("disabled", true);
                            $(rowId + " td button").fadeOut("slow");
                            keepATrackOfInputsInForm++;
                            $("#row" + keepATrackOfInputsInForm).fadeIn("slow");
                            $("#row" + keepATrackOfInputsInForm + " td input:eq(0)").val(keepATrackOfInputsInForm);
                            if (keepATrackOfInputsInForm > 1)
                                $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").val($("#row" + (keepATrackOfInputsInForm - 1) + " td input:eq(1)").val());
                            $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").focus();
                            dataListForName();
                            dataListForWhom();
                            dataListForPurpose();

                        }
                    },
                    error: function (xhr, status, error) {
                        $("#loader").fadeOut(150);
                        $(rowId + " td cite").html("Error : " + error);
                        $(rowId + " td cite").attr("class", "glyphicon glyphicon-thumbs-down");
                        $(rowId).attr("class", "danger");
                        $(rowId + " td input").prop("disabled", true);
                        $(rowId + " td button").fadeOut("slow");
                        keepATrackOfInputsInForm++;
                        $("#row" + keepATrackOfInputsInForm).fadeIn("slow");
                        $("#row" + keepATrackOfInputsInForm + " td input:eq(0)").val(keepATrackOfInputsInForm);
                        if (keepATrackOfInputsInForm > 1)
                            $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").val($("#row" + (keepATrackOfInputsInForm - 1) + " td input:eq(1)").val());
                        $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").focus();
                    }
                });
                $("#loader").fadeIn(150);
            }
            return true;
        }
        $(".add").click(function () {
                if (parseFloat($("#row" + keepATrackOfInputsInForm + " td input:eq(3)")
                        .val()) > parseFloat($("#row" + keepATrackOfInputsInForm + " td #current").html())) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("There are not enough items <br>to issue the given items.");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(2)").focus();
                } else if ($("#row" + keepATrackOfInputsInForm + " td cite").html() == "")
                    sendAjax(keepATrackOfInputsInForm);
                else
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Check Your Input");
            });
    });
