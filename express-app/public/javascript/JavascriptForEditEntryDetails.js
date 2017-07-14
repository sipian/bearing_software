$(function () {
    $(".nav.navbar-nav li:eq(8)").attr("class", "active");

    $("#print").click(function () {
            window.print();
        });
    $("#usr1").focus();
    dataListForName();

    $("body").on("focus", "#usr1", function () {
            $("#editEntryblock").fadeOut();
            $("#question1").html("");
            $("#resultdoob").html("");
            $("#question2").html("");
            dataListForName();
        });

    $("body").on("click", "#oldNameSubmit", function () {
            let name = $("#usr1").val();
            if (!name) {
                $(".error1").html("Enter Old Item Name.");
                $("#editEntryblock").fadeOut();
                $("#question1").html("");
            } else {
                let flag = checkIfExists(name);
                if (flag == 3) {
                    $(".error1").html("Entered Name Does Not Exist.");
                    $("#editEntryblock").fadeOut();
                    $("#question1").html("");
                } else if (flag == 1) {
                    $(".error1").html("Some Error Occured while Getting Data.");
                    $("#editEntryblock").fadeOut();
                    $("#question1").html("");
                } else {
                    $(".error1").html("");
                    $("#editEntryblock").fadeIn();
                }
            }
        });
    $("#usr1").keyup(function (event) {
            if (event.keyCode == 13) {
                $("#oldNameSubmit").click();
            }
        });
    $("body").on("click", "#editIssuedButton", function () {
            dataListForWhom();
            dataListForPurpose();
            $("#question2").html("");
            $("#editEntryblockButtons").fadeOut();
            $("#resultdoob").html("");
            $("#question1").html(`
          <span style="color:purple;margin-left:37%;">Edit Entry In Issued Item</span>
              <table class="table table-condensed"  style="margin-top:0%;">
            <thead>
              <tr>
                <th>Original Date Of Entry</th>
                 <th>Original Quantity Issued</th>
                <th>Originally Whom To Issue</th>
                <th>Original Purpose Of Issue</th>
               </tr>
            </thead>
            <tbody id="table_body">
            <tr>
            <td><input type="text" class="form-control dateOfEntry" id="dateOfEntry1" name="dateOfEntry" placeholder="enter date of entry....."  required></td>
            <td><input type="number" id="quantity" class="form-control quantity" name="quantity" placeholder="enter original quantity....." size=4 min=0 required></td>
            <td><input type="text" class="form-control whom" id="whom" name="whom" placeholder="enter whom to issued....."  required></td>
            <td><input type="text" class="form-control purpose" id="purpose" name="purpose" placeholder="enter purpose of issue....."  required></td>
            </tr>
            </tbody>
            </table>
<button id="check" class="btn btn-danger btn-block" >Check Entry</button>
          <div class="btn-group btn-group-justified" style="display:none;" id="editEntryblockButtons">
              <a href="#" class="btn btn-primary" id="editIssuedDateButton">Change Date Of Entry</a>
              <a href="#" class="btn btn-primary" id="editIssuedQtyButton">Change Quantity Issued</a>
              <a href="#" class="btn btn-primary" id="editIssuedWhomButton">Change Whom To Issued</a>
              <a href="#" class="btn btn-primary" id="editIssuedPurposeButton">Change Purpose Of Issue</a>
         </div>
            `);
            $(".dateOfEntry").datepicker({
                    dateFormat: 'dd-mm-yy'
                });
        });
    $("body").on("focus", "#dateOfEntry1 , #quantity , #whom , #purpose", function () {
            $("#question2").html("");
            $("#resultdoob").html("");
            $("#editEntryblockButtons").fadeOut();
        })

    function functionName() {
        $("#question2").html("");
        $("#editEntryblockButtons").fadeOut();
        dataListForWhom();
        dataListForPurpose();
    }

    function checkOldIssued() {
        let inputToSendViaAjaxPost = `issueEditDate=` + encodeURIComponent($("#dateOfEntry1").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&quantity=` + encodeURIComponent($("#quantity").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&whom=` + encodeURIComponent($("#whom").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&purpose=` + encodeURIComponent($("#purpose").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/getIssuedEntry1024",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error") {
                    functionName();
                    $("#resultdoob").html("Some Error Occured While Fetching The Data");
                } else if (result == "not found") {
                    $("#resultdoob").html("<h2>Check All Your Details As No Entry With Above Entry Found.</h2>");
                    functionName();
                } else {
                    $("#resultdoob").html("");
                    $("#editEntryblockButtons").fadeIn();
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                functionName();
                $("#resultdoob").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }


    $("body").on("click", "#check", function () {
            if (!$("#dateOfEntry1").val())
                $("#resultdoob").html("Please Enter Original Entry Date");
            else if (!$("#quantity").val())
                $("#resultdoob").html("Please Enter Original Issued Quantity");
            else if (!$("#whom").val())
                $("#resultdoob").html("Please Enter Originally Whom To Issued");
            else if (!$("#purpose").val())
                $("#resultdoob").html("Please Enter Original Purpose Of Issue.");
            else {
                checkOldIssued();
            }
        });

    function editIssuedDate() {
        let inputToSendViaAjaxPost = `date=` + encodeURIComponent($("#dateOfEntry2").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
        + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editIssuedEntryDate",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error")
                    $(".error2").html("Some Error Occured While Fetching The Data");
                else if (result == "incomplete")
                    $(".error2").html("Enter Finding Details First.");
                else {
                    $(".error2").html("Changed Date Successfully.");
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $(".error2").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }
    $("body").on("click", "#editIssuedDateButton", function () {
            $("#question2").html(`
               <div class="form-group">
               <label class="control-label" for="usr2">New Item Date:</label>
                   <input type="text" class="form-control dateOfEntry" id="dateOfEntry2" name="dateOfEntry" placeholder="enter new date of entry....."  required>
                   <span class="error2"></span>
                   <button type="button" class="btn btn-primary btn-block" name="button" id="newDateSubmitIssued">Edit Date</button>
                  </div>
             `);
            $(".dateOfEntry").datepicker({
                    dateFormat: 'dd-mm-yy'
                });
        });
    $("body").on("click", "#newDateSubmitIssued", function () {
            let group = $("#dateOfEntry2").val();
            if (!group) {
                $(".error2").html("Please Enter New Date.");
            } else {
                $(".error2").html("");
                editIssuedDate();
            }
        });

    function editIssuedQuantity() {
        let inputToSendViaAjaxPost = `quantity=` + encodeURIComponent($("#Issuedquantity").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editIssuedEntryQuantity",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error")
                    $(".error3").html("Some Error Occured While Fetching The Data");
                else if (result == "incomplete")
                    $(".error3").html("Enter Finding Details First.");
                else if (result == "negative")
                    $(".error3").html("The Curent Balance Is Becoming Negative With This New Balance.");
                else {
                    $(".error3").html("Changed Quantity Successfully.");
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $(".error3").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }
    $("body").on("click", "#editIssuedQtyButton", function () {
            $("#question2").html(`
           <div class="form-group">
           <label class="control-label" for="usr2">New Item Quantity Issued:</label>
           <input type="number" id="Issuedquantity" class="form-control quantity" name="quantity" placeholder="enter new quantity....." size=4 min=0 required>
           <span class="error3"></span>
               <button type="button" class="btn btn-primary btn-block" name="button" id="newQuantitySubmitIssued">Edit Quantity</button>
              </div>
         `);
        });
    $("body").on("click", "#newQuantitySubmitIssued", function () {
            let group = $("#Issuedquantity").val();
            if (!group) {
                $(".error3").html("Please Enter New Quantity.");
            } else {
                $(".error3").html("");
                editIssuedQuantity();
            }
        });

    function editIssuedWhom() {
        let inputToSendViaAjaxPost = `whom=` + encodeURIComponent($("#IssuedWhom").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                 + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editIssuedEntrywhom",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error")
                    $(".error4").html("Some Error Occured While Fetching The Data");
                else if (result == "incomplete")
                    $(".error4").html("Enter Finding Details First.");
                else {
                    $(".error4").html("Changed Whom To Issued Successfully.");
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $(".error4").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }
    $("body").on("click", "#editIssuedWhomButton", function () {
            $("#question2").html(`
            <div class="form-group">
            <label class="control-label" for="usr2">New Whom To Issued:</label>
            <input type="text" class="form-control whom" id="IssuedWhom" name="whom" placeholder="enter whom to issued....."  required>
            <span class="error4"></span>
                <button type="button" class="btn btn-primary btn-block" name="button" id="newWhomSubmitIssued">Edit Whom</button>
               </div>
          `);
            dataListForWhom();
        });
    $("body").on("click", "#newWhomSubmitIssued", function () {
            let group = $("#IssuedWhom").val();
            if (!group) {
                $(".error4").html("Please Enter New Whom To Issued.");
            } else {
                $(".error4").html("");
                editIssuedWhom();
            }
        });

    function editIssuedPurpose() {
        let inputToSendViaAjaxPost = `purpose=` + encodeURIComponent($("#IssuedPurpose").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
             + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editIssuedEntryPurpose",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error")
                    $(".error5").html("Some Error Occured While Fetching The Data");
                else if (result == "incomplete")
                    $(".error5").html("Enter Finding Details First.");
                else {
                    $(".error5").html("Changed Purpose Of Issue Successfully.");
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $(".error5").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }
    $("body").on("click", "#editIssuedPurposeButton", function () {
            $("#question2").html(`
             <div class="form-group">
             <label class="control-label" for="usr2">New Purpose Of Issue:</label>
             <input type="text" class="form-control purpose" id="IssuedPurpose" name="whom" placeholder="enter Purpose Of Issue....."  required>
             <span class="error5"></span>
                 <button type="button" class="btn btn-primary btn-block" name="button" id="newPurposeSubmitIssued">Edit Purpose</button>
                </div>
           `);
            dataListForPurpose();
        });
    $("body").on("click", "#newPurposeSubmitIssued", function () {
            let group = $("#IssuedPurpose").val();
            if (!group) {
                $(".error5").html("Please Enter New Purpose Of Issue.");
            } else {
                $(".error5").html("");
                editIssuedPurpose();
            }
        });

    /**********************RECEIVED DETAILS**********************************/


    $("body").on("click", "#editReceivedButton", function () {
            dataListForMake();
            $("#question2").html("");
            $("#editEntryblockButtons8400700457").fadeOut();
            $("#resultdoob").html("");

            $("#question1").html(`
          <span style="color:purple;margin-left:31%;">Edit Entry In Recieved Item/Add New Item</span>
              <table class="table table-condensed"  style="margin-top:0%;">
            <thead>
              <tr>
                <th>Original Date Of Entry</th>
                 <th>Original Quantity Received</th>
                <th>Original Make</th>
                <th>Original Bill no./Dispatch Details</th>
               </tr>
            </thead>
            <tbody id="table_body">
            <tr>
            <td><input type="text" class="form-control dateOfEntry" id="dateOfEntry84007004571" name="dateOfEntry" placeholder="enter date of entry....."  required></td>
            <td><input type="number" id="quantity8400700457" class="form-control quantity" name="quantity" placeholder="enter original quantity....." size=4 min=0 required></td>
            <td><input type="text" class="form-control make" id="make8400700457" name="make" placeholder="enter make Of received....."  required></td>
            <td><input type="text" class="form-control" id="bill8400700457" name="bill" placeholder="enter Bill Details of received....."  required></td>
            </tr>
            </tbody>
            </table>
<button id="check8400700457" class="btn btn-danger btn-block" >Check Entry</button>
          <div class="btn-group btn-group-justified" style="display:none;" id="editEntryblockButtons8400700457">
              <a href="#" class="btn btn-primary" id="editReceivedDateButton">Change Date Of Entry</a>
              <a href="#" class="btn btn-primary" id="editReceivedQtyButton">Change Quantity Recieved</a>
              <a href="#" class="btn btn-primary" id="editReceivedMakeButton">Change Make</a>
              <a href="#" class="btn btn-primary" id="editReceivedBillButton">Change Bill no./Dispatch Details</a>
         </div>
            `);
            $(".dateOfEntry").datepicker({
                    dateFormat: 'dd-mm-yy'
                });
        });
    $("body").on("focus", "#dateOfEntry84007004571 , #quantity8400700457 , #make8400700457 , #bill8400700457", function () {
            $("#question2").html("");
            $("#resultdoob").html("");
            $("#editEntryblockButtons8400700457").fadeOut();
        })

    function functionName$() {
        $("#question2").html("");
        $("#editEntryblockButtons8400700457").fadeOut();
        dataListForMake();
    }

    function checkOldReceived$() {
        let inputToSendViaAjaxPost = `receiveEditDate=` + encodeURIComponent($("#dateOfEntry84007004571").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                 + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                 + `&quantity=` + encodeURIComponent($("#quantity8400700457").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                 + `&make=` + encodeURIComponent($("#make8400700457").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                 + `&bill=` + encodeURIComponent($("#bill8400700457").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/getReceivedEntry1024",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error") {
                    functionName$();
                    $("#resultdoob").html("Some Error Occured While Fetching The Data");
                } else if (result == "not found") {
                    $("#resultdoob").html("<h2>Check All Your Details As No Entry With Above Entry Found.</h2>");
                    functionName$();
                } else {
                    $("#resultdoob").html("");
                    $("#editEntryblockButtons8400700457").fadeIn();
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                functionName$();
                $("#resultdoob").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }


    $("body").on("click", "#check8400700457", function () {
            if (!$("#dateOfEntry84007004571").val())
                $("#resultdoob").html("Please Enter Original Entry Date");
            else if (!$("#quantity8400700457").val())
                $("#resultdoob").html("Please Enter Original Received Quantity");
            else if (!$("#make8400700457").val())
                $("#resultdoob").html("Please Enter Original Make");
            else if (!$("#bill8400700457").val())
                $("#resultdoob").html("Please Enter Original Bill.");
            else {
                checkOldReceived$();
            }
        });

    function editReceivedDate() {
        let inputToSendViaAjaxPost = `date=` + encodeURIComponent($("#dateOfEntry84007004572").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
                + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editReceivedEntryDate",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error")
                    $(".error84007004572").html("Some Error Occured While Fetching The Data");
                else if (result == "incomplete")
                    $(".error84007004572").html("Enter Finding Details First.");
                else {
                    $(".error84007004572").html("Changed Date Successfully.");
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $(".error84007004572").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }
    $("body").on("click", "#editReceivedDateButton", function () {
            $("#question2").html(`
               <div class="form-group">
               <label class="control-label" for="usr2">New Item Date:</label>
                   <input type="text" class="form-control dateOfEntry" id="dateOfEntry84007004572" name="dateOfEntry" placeholder="enter new date of entry....."  required>
                   <span class="error84007004572"></span>
                   <button type="button" class="btn btn-primary btn-block" name="button" id="newDateSubmitReceived">Edit Date</button>
                  </div>
             `);
            $(".dateOfEntry").datepicker({
                    dateFormat: 'dd-mm-yy'
                });
        });
    $("body").on("click", "#newDateSubmitReceived", function () {
            let group = $("#dateOfEntry84007004572").val();
            if (!group) {
                $(".error84007004572").html("Please Enter New Date.");
            } else {
                $(".error84007004572").html("");
                editReceivedDate();
            }
        });

    function editReceivedQuantity() {
        let inputToSendViaAjaxPost = `quantity=` + encodeURIComponent($("#Receivedquantity").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
            + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editReceivedEntryQuantity",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error")
                    $(".error84007004573").html("Some Error Occured While Fetching The Data");
                else if (result == "incomplete")
                    $(".error84007004573").html("Enter Finding Details First.");
                else {
                    $(".error84007004573").html("Changed Quantity Successfully.");
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $(".error84007004573").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }
    $("body").on("click", "#editReceivedQtyButton", function () {
            $("#question2").html(`
           <div class="form-group">
           <label class="control-label" for="usr2">New Item Quantity Received:</label>
           <input type="number" id="Receivedquantity" class="form-control quantity" name="quantity" placeholder="enter new quantity....." size=4 min=0 required>
               <button type="button" class="btn btn-primary btn-block" name="button" id="newQuantitySubmitReceived">Edit Quantity</button>
               <span class="error84007004573"></span>
              </div>
         `);
        });
    $("body").on("click", "#newQuantitySubmitReceived", function () {
            let group = $("#Receivedquantity").val();
            if (!group) {
                $(".error84007004573").html("Please Enter New Quantity.");
            } else {
                $(".error84007004573").html("");
                editReceivedQuantity();
            }
        });

    function editReceivedMake() {
        let inputToSendViaAjaxPost = `make=` + encodeURIComponent($("#ReceivedMake").val().toLowerCase().trim().replace(/\s\s+/g, ' '))
                 + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editReceivedEntryMake",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error")
                    $(".error84007004574").html("Some Error Occured While Fetching The Data");
                else if (result == "incomplete")
                    $(".error84007004574").html("Enter Finding Details First.");
                else {
                    $(".error84007004574").html("Changed Make Successfully.");
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $(".error84007004574").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }
    $("body").on("click", "#editReceivedMakeButton", function () {
            $("#question2").html(`
            <div class="form-group">
            <label class="control-label" for="usr2">New Make:</label>
            <input type="text" class="form-control make" id="ReceivedMake" name="make" placeholder="enter make....."  required>
                <button type="button" class="btn btn-primary btn-block" name="button" id="newMakeSubmitReceived">Edit Make</button>
                <span class="error84007004574"></span>
               </div>
          `);
            dataListForMake();
        });
    $("body").on("click", "#newMakeSubmitReceived", function () {
            let group = $("#ReceivedMake").val();
            if (!group) {
                $(".error84007004574").html("Please Enter New Make.");
            } else {
                $(".error84007004574").html("");
                editReceivedMake();
            }
        });

    function editReceivedBill() {
        let inputToSendViaAjaxPost = `bill=` + encodeURIComponent($("#ReceivedBill").val().toLowerCase().trim().replace(/\s\s+/g, ' ')) 
            + `&names=` + encodeURIComponent($("#usr1").val().toLowerCase().trim().replace(/\s\s+/g, ' '));
        $.ajax({
            type: "GET",
            url: "/editReceivedEntryBill",
            data: inputToSendViaAjaxPost,
            success: function (result, status, xhr) {
                $("#loader").fadeOut(150);
                $("#loader").fadeOut(150);
                if (result == "error")
                    $(".error84007004575").html("Some Error Occured While Fetching The Data");
                else if (result == "incomplete")
                    $(".error84007004575").html("Enter Finding Details First.");
                else {
                    $(".error84007004575").html("Changed Bill Details Successfully.");
                }
            },
            error: function (xhr, status, error) {
                $("#loader").fadeOut(150);
                $(".error84007004575").html("Some Error Occured While Fetching The Data");
            }
        });
        $("#loader").fadeIn(150);
    }
    $("body").on("click", "#editReceivedBillButton", function () {
            $("#question2").html(`
             <div class="form-group">
             <label class="control-label" for="usr2">New Bill Details:</label>
             <input type="text" class="form-control bill" id="ReceivedBill" name="bill" placeholder="enter bill details....."  required>
                 <button type="button" class="btn btn-primary btn-block" name="button" id="newBillSubmitReceived">Edit Bill Details</button>
                 <span class="error84007004575"></span>
                </div>
           `);
        });
    $("body").on("click", "#newBillSubmitReceived", function () {
            let group = $("#ReceivedBill").val();
            if (!group) {
                $(".error84007004575").html("Please Enter New Bill Details.");
            } else {
                $(".error84007004575").html("");
                editReceivedBill();
            }
        });
});
