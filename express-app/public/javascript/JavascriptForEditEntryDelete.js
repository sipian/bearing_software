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
                url: "/viewDetails/viewDetailsOf1Item",
                data: inputToSendViaAjaxPost,
                success: function (result, status, xhr) {
                    $("#loader").fadeOut(150);
                    if (result == "error")
                        $("#resultdoob").html("Some Error Occured While Fetching The Data");
                    else if (result == "doesNotexist")
                        $("#resultdoob").html("<h2>Item not found</h2>");
                    else{
                        $("#resultdoob").html(result);

                        $("#question1").html(`<button type="button" name="button" id= "deleteEntry" class="btn btn-danger btn-lg btn-block" style="margin-top:-5%;">DELETE ENTRY</button>`);
                    }  
                },
                error: function (xhr, status, error) {
                    $("#loader").fadeOut(150);
                    $("#resultdoob").html("Error Occured");
                }
            });
            $("#loader").fadeIn(150);
        }
    }

    function deleteEntry() {
        let name = $("#usr1").val();
        var inputToSendViaAjaxPost = `name=` + encodeURIComponent(name.toLowerCase().trim().replace(/\s\s+/g, ' '));

        $.ajax({
            type: "GET",
            url: "/deleteEntry",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                if (result == "error")
                    $("#question1").html("Some Error Occured While Deleting Entry");
                else if (result == "success"){
                    $("#question1").html("Deleted Entry Successfully");
                    dataListForName();
                }
                $("#usr1").val("");
                $("#resultdoob").html("");
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $("#question1").html("Some Error Occured While Deleting Entry");
                $("#usr1").val("");
                $("#resultdoob").html("");
            }
        });
        $("#loader").fadeIn(150);
    }


    $("body").on("click", "#deleteEntry", function () {
            if(confirm("Once You Delete An Entry It Cannot Be Restored. Are You Sure You Want To Continue ??"))
                deleteEntry();           
        });

    $("body").on("focus", "#usr1", function () {
            $("#question1").html("");
            $("#resultdoob").html("");
            dataListForName();
        });


    $("body").on("click", "#oldNameSubmit", function () {
            let name = $("#usr1").val();
            if (!name) {
                $(".error1").html("Enter The   Item Name.");
                $("#question1").html("");
            } else {
                let flag = checkIfExists(name);
                if (flag == 3) {
                    $(".error1").html("Entered Name Does Not Exist.");
                    $("#question1").html("");
                } else if (flag == 1) {
                    $(".error1").html("Some Error Occured while Getting Data.");
                    $("#question1").html("");
                } else {
                    $(".error1").html("");
                    ResultBalance();
                }
            }
        });

    $("#usr1").keyup(function (event) {
            if (event.keyCode == 13) {
                $("#oldNameSubmit").click();
            }
        });
});