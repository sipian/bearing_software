var keepATrackOfInputsInForm = 1;
var flagForSubmittingForm = 0;
var maximumElements = 5;
$(document)
    .ready(function () {
        $(".nav.navbar-nav li:eq(1)").attr("class", "active");
        $("#print").click(function () {
                window.print();
            })
        $("#reload").click(function () {
                location.reload(false);
            });

        dataListForName();
        dataListForUnit();
        dataListForGroup();
        dataListForMake();

        /* Functions for datalists ends*/

        todaysDate();
        $(".dateOfEntry").datepicker({
                dateFormat: 'dd-mm-yy'
            });
        $("#row1 td input:eq(1)").focus();

        $("#reload").click(function () {
                location.reload(false);
            });


        //checking       date       of            entry

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


        //checking      name     of        item


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
                } else if (check == 1)
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Some Error Occured while Checking.");
                else if (check == 2) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(2)").focus();
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("The Item Already Exists.<br>Can't be added");
                } else if (check == 3)
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
                else
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("error");

            });



        //checking      unit     of        item




        $(document).on("keydown", ".item_unit", function (e) {
                if (e.which == 13) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(4)").focus();
                }
            });

        $(document).on("focusout", ".item_unit", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(3)").val();
                if (checkUnit(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter the unit");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(3)").focus();
                } else
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
            });



        //checking      group     of        item




        $(document).on("keydown", ".group", function (e) {
                if (e.which == 13) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(5)").focus();
                }
            });

        $(document).on("focusout", ".group", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(4)").val();
                if (checkGroup(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter the group");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(4)").focus();
                } else
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
            });


        //checking      make     of        item




        $(document).on("keydown", ".make", function (e) {
                if (e.which == 13) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(6)").focus();
                }
            });

        $(document).on("focusout", ".make", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(5)").val();
                if (checkMake(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter the make");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(5)").focus();
                } else
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
            });




        //checking      bill     of        item




        $(document).on("keydown", ".bill", function (e) {
                if (e.which == 13) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(7)").focus();
                }
            });

        $(document).on("focusout", ".bill", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(6)").val();
                if (checkBill(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter bill details");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(6)").focus();
                } else
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
            });


        //checking      balance     of        item


        $(document).on("focusout", ".balance", function () {
                let item = $("#row" + keepATrackOfInputsInForm + " td input:eq(7)").val();
                if (checkNumber(item)) {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Please enter the balance correctly");
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(7)").focus();
                } else {
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("");
                    $("#row" + keepATrackOfInputsInForm + " td button").fadeIn("slow");
                    //$("#row"+keepATrackOfInputsInForm+" td button").focus();
                }
            })

        $(document).on("keydown", ".balance", function (e) {
                var key = e.which;
                if (key == 13 || key == 9) {
                    $("#row" + keepATrackOfInputsInForm + " td input:eq(7)").focusout();
                }
            });

        function sendAjax(data) {
            if (data) {
                var rowId = "#row" + data;
                var inputToSendViaAjaxPost = `date=` + encodeURIComponent($(rowId + " td input:eq(1)").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                + `&names=` + encodeURIComponent($(rowId + " td input:eq(2)").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&unit=` + encodeURIComponent($(rowId + " td input:eq(3)").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&group=` + encodeURIComponent($(rowId + " td input:eq(4)").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&make=` + encodeURIComponent($(rowId + " td input:eq(5)").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&bill=` + encodeURIComponent($(rowId + " td input:eq(6)").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&openingBalance=` + encodeURIComponent($(rowId + " td input:eq(7)").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
                    
                $.ajax({
                    type: "POST",
                    url: "/stockHandler/addToDatabase",
                    data: inputToSendViaAjaxPost,
                    success: function (result, status, xhr) {
                        $("#loader").fadeOut(150);
                        if (result == "error") {
                            $(rowId + " td cite").html("Could Not Be Added.");
                            $(rowId + " td cite").attr("class", "glyphicon glyphicon-thumbs-down");
                            $(rowId).attr("class", "danger");
                            $(rowId + " td input").prop("disabled", true);
                            $(rowId + " td button").fadeOut("slow");
                            keepATrackOfInputsInForm++;
                            $("#row" + keepATrackOfInputsInForm).fadeIn("slow");
                            $("#row" + keepATrackOfInputsInForm + " td input:eq(0)").val(keepATrackOfInputsInForm);
                            if (keepATrackOfInputsInForm > 1)$("#row" + keepATrackOfInputsInForm + " td input:eq(1)").val($("#row" + (keepATrackOfInputsInForm - 1) + " td input:eq(1)")    .val());
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
                            if (keepATrackOfInputsInForm > 1)$("#row" + keepATrackOfInputsInForm + " td input:eq(1)").val($("#row" + (keepATrackOfInputsInForm - 1) + " td input:eq(1)")    .val());
                            $("#row" + keepATrackOfInputsInForm + " td input:eq(1)").focus();
                            dataListForName();
                            dataListForUnit();
                            dataListForGroup();
                            dataListForMake();
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
                $("#loader")
                    .fadeIn(150);
            }
            return true;
        }
        $(".add").click(function () {
                if ($("#row" + keepATrackOfInputsInForm + " td cite").html() === "")
                    sendAjax(keepATrackOfInputsInForm);
                else
                    $("#row" + keepATrackOfInputsInForm + " td cite").html("Check Your Input");
            });
    });
