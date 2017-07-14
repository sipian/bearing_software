$(function () {
    $(".nav.navbar-nav li:eq(8)").attr("class", "active");
    $("#print").click(function () {
            window.print();
        });
    $("#usr1").focus();
    dataListForName();

    function ResultBalance() {
        var data = $("#usr1").val();
        if (data) {
            var inputToSendViaAjaxPost = "data=" + encodeURIComponent(data.toLowerCase().trim().replace(/\s\s+/g, ' '));
            $.ajax({
                type: "GET",
                url: "/viewDetails/viewBalanceOf1Item",
                data: inputToSendViaAjaxPost,
                success: function (result, status, xhr) {
                    $("#loader").fadeOut(150);
                    if (result == "error")
                        $("#resultdoob").html("Some Error Occured While Fetching The Data");
                    else if (result == "doesNotexist")
                        $("#resultdoob").html("<h2>Item not found</h2>");
                    else
                        $("#resultdoob").html(result);
                },
                error: function (xhr, status, error) {
                    $("#loader").fadeOut(150);
                    $("#resultdoob").html("Error Occured");
                }
            });
            $("#loader").fadeIn(150);
        }
    }


    function ResultBalance2() {
        var data = $("#usr2").val();
        if (data) {
            var inputToSendViaAjaxPost = "data=" + encodeURIComponent(data.toLowerCase().trim().replace(/\s\s+/g, ' '));
            $.ajax({
                type: "GET",
                url: "/viewDetails/viewBalanceOf1Item",
                data: inputToSendViaAjaxPost,
                success: function (result, status, xhr) {
                    $("#loader").fadeOut(150);
                    if (result == "error")
                        $("#resultdoob").html("Some Error Occured While Fetching The Data");
                    else if (result == "doesNotexist")
                        $("#resultdoob").html("<h2>Item not found</h2>");
                    else
                        $("#resultdoob").html(result);
                },
                error: function (xhr, status, error) {
                    $("#loader").fadeOut(150);
                    $("#resultdoob").html("Error Occured");
                }
            });
            $("#loader").fadeIn(150);
        }
    }



    function changeName() {
        let name = $("#usr1").val();
        let newName = $("#usr2").val();
        var inputToSendViaAjaxPost = `name=` + encodeURIComponent(name.toLowerCase().trim().replace(/\s\s+/g, ' '))
                             + `&newName=` + encodeURIComponent(newName.toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editName",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                if (result == "error")
                    $(".error2").html("Some Error Occured While Changing Name");
                else {
                    $(".error2").html("Succesfully changed Name.");
                    ResultBalance2();
                    $("#usr1").val(newName);
                    dataListForName();
                }
            },
            error: function (xhr, status, error) {
                $(".error2").html("Some Error Occured While Changing Name");
            }
        });
    }

    function changeGroup() {
        let name = $("#usr1").val();
        let newGroup = $("#usr3").val();
        var inputToSendViaAjaxPost = `name=` + encodeURIComponent(name.toLowerCase().trim().replace(/\s\s+/g, ' '))
                             + `&newGroup=` + encodeURIComponent(newGroup.toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editGroup",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                if (result == "error")
                    $(".error3").html("Some Error Occured While Changing Group");
                else {
                    $(".error3").html("Succesfully changed Group.");
                    ResultBalance();
                    datalistForGroup();
                }
            },
            error: function (xhr, status, error) {
                $(".error3").html("Some Error Occured While Changing Group");
            }
        });
    }

    function changeUnit() {
        let name = $("#usr1").val();
        let newUnit = $("#usr4").val();
        var inputToSendViaAjaxPost = `name=` + encodeURIComponent(name.toLowerCase().trim().replace(/\s\s+/g, ' '))
                                 + `&newUnit=` + encodeURIComponent(newUnit.toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editUnit",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                if (result == "error")
                    $(".error4").html("Some Error Occured While Changing Unit");
                else {
                    $(".error4").html("Succesfully changed Unit.");
                    dataListForUnit();
                    ResultBalance();
                }
            },
            error: function (xhr, status, error) {
                $(".error4").html("Some Error Occured While Changing Unit");
            }
        });
    }

    //for old name ends

    $("body").on("focus", "#usr1", function () {
            $("#editNameBlock").fadeOut();
            $("#question1").html("");
            $("#resultdoob").html("");
            dataListForName();
        });


    $("body").on("click", "#oldNameSubmit", function () {
            let name = $("#usr1").val();
            if (!name) {
                $(".error1").html("Enter Old Item Name.");
                $("#editNameBlock").fadeOut();
                $("#question1").html("");
            } else {
                let flag = checkIfExists(name);
                if (flag == 3) {
                    $(".error1").html("Entered Name Does Not Exist.");
                    $("#editNameBlock").fadeOut();
                    $("#question1").html("");
                } else if (flag == 1) {
                    $(".error1").html("Some Error Occured while Getting Data.");
                    $("#editNameBlock").fadeOut();
                    $("#question1").html("");
                } else {
                    $(".error1").html("");
                    ResultBalance();
                    $("#editNameBlock").fadeIn();
                }
            }
        });

    $("#usr1").keyup(function (event) {
            if (event.keyCode == 13) {
                $("#oldNameSubmit").click();
            }
        });
    //for old name ends

    /*        event handlers for 2 buttons on page*/
    /*        event handlers for 2 buttons on page ends*/

    //new name handlers
    $("body").on("click", "#newNameButton", function () {
            $("#question1").html(`
            <div class="form-group">
            <label class="control-label" for="usr2"><h3>New Item Name:</h3></label>
                <input type="text" class="form-control item_name" id="usr2" name="newItemName" placeholder="enter new name.................">
                <span class="error2" ></span>
                <button type="button" class="btn btn-primary btn-block" name="button" id="newNameSubmit">Submit</button>
               </div>
        `);
            dataListForName();
        });
    $("body").on("click", "#newNameSubmit", function () {
            let name = $("#usr2").val();
            if (!name) {
                $(".error2").html("Please Enter New Item Name.");
            } else {
                let flag = checkIfExists(name);
                if (flag == 2) {
                    $(".error2").html("Entered Name Already Exists.");
                } else if (flag == 1) {
                    $(".error2").html("Some Error Occured while Getting Data.");
                } else {
                    $(".error2").html("");
                    changeName();
                }
            }
        });
    //new name handlers ends

    $("body").on("click", "#newGroupButton", function () {
            $("#question1").html(`
             <div class="form-group">
             <label class="control-label" for="usr3"><h3>New Item Group:</h3></label>
                 <input type="text" class="form-control group" id="usr3" name="newItemGroup" placeholder="enter new group.................">
                 <span class="error3"></span>
                 <button type="button" name="button" class="btn btn-primary btn-block"  id="newGroupSubmit">Submit</button>
                </div>`);
            dataListForGroup();
        });
    $("body").on("click", "#newGroupSubmit", function () {
            let group = $("#usr3").val();
            if (!group) {
                $(".error3").html("Please Enter New Group.");
            } else {
                $(".error3").html("");
                changeGroup();
            }
        });


    $("body").on("click", "#newUnitButton", function () {
            $("#question1").html(`
              <div class="form-group">
              <label class="control-label" for="usr4"><h3>New Item Unit:</h3></label>
                  <input type="text" class="form-control item_unit" id="usr4" name="newItemUnit" placeholder="enter new unit.................">
                  <span class="error4"></span>
                  <button type="button" name="button"  class="btn btn-primary btn-block"  id="newUnitSubmit">Submit</button>
                 </div>`);
            dataListForUnit();
        });

    $("body").on("click", "#newUnitSubmit", function () {
            let unit = $("#usr4").val();
            if (!unit) {
                $(".error4").html("Please Enter New Unit.");
            } else {
                $(".error4").html("");
                changeUnit();
            }
        });
});
