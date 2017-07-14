document.getElementById("navigation")
    .innerHTML = `
<nav class="navbar navbar-inverse navbar-fixed-top">
<div class="container-fluid">
    <div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="/">BSIL STORE</a>
  </div>
  <div class="collapse navbar-collapse" id="myNavbar">
    <ul class="nav navbar-nav">
      <li><a href="/">Home</a></li>
      <li><a href="/add_new_item" target="_self">Add New Item Into Ledger</a></li>
      <li><a href="/issue_present_item" target="_self">Issue Item From Stock</a></li>
      <li><a href="/receive_present_item" target="_self">Recieve Item Into Stock</a></li>
      <li><a href="/view_item_details" target="_self">View Details Of Item In Stock</a></li>
      <li><a href="/reports" target="_self">Reports</a></li>
      <li><a href="#" id="print">Print</a></li>
      <li><a href="/balanceZero" target="_self">Items With Balance Zero</a></li>
      <li><a href="/edit_entry" target="_self">Edit Entry</a></li>
    </ul>
  </div>
</div>
</nav>
`;

function dataListForName() {
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/datalist/name"
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else {
                let datalistArray = result.split("!@#$%^&*");
                $(".item_name,#searchItem1,#searchItem2")
                    .autocomplete({
                        source: datalistArray
                    });
            }
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
}

function dataListForUnit() {
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/datalist/unit"
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else {
                let datalistArray = result.split("!@#$%^&*");
                $(".item_unit")
                    .autocomplete({
                        source: datalistArray
                    });
            }
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
}

function dataListForGroup() {
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/datalistForGroup"
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else {
                let datalistArray = result.split("!@#$%^&*");
                $(".group")
                    .autocomplete({
                        source: datalistArray
                    });
            }
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
}

function dataListForMake() {
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/datalist/make"
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else {
                let datalistArray = result.split("!@#$%^&*");
                $(".make")
                    .autocomplete({
                        source: datalistArray
                    });
            }
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
}

function dataListForWhom() {
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/datalist/whomToIssue"
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else {
                let datalistArray = result.split("!@#$%^&*");
                $(".whom")
                    .autocomplete({
                        source: datalistArray
                    });
            }
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
}

function dataListForPurpose() {
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/datalist/purposeOfIssue"
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else {
                let datalistArray = result.split("!@#$%^&*");
                $(".purpose")
                    .autocomplete({
                        source: datalistArray
                    });
            }
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
}

function checkIfExists(inputCheck) {
    let inputToSendViaAjaxPost = "data=" + encodeURIComponent(inputCheck.toLowerCase().trim().replace(/\s\s+/g, ' '));
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/checkIfEntryExists"
        , data: inputToSendViaAjaxPost
        , async: false
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else if (result == "existsAlready") flag = 2;
            else if (result = "doesNotexist") flag = 3;
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
    return flag;
}

function checkIfExistsGroup(inputCheck) {
    let inputToSendViaAjaxPost = "data=" + encodeURIComponent(inputCheck.toLowerCase().trim().replace(/\s\s+/g, ' '));
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/checkIfEntryExistsGroup"
        , data: inputToSendViaAjaxPost
        , async: false
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else if (result == "existsAlready") flag = 2;
            else if (result = "doesNotexist") flag = 3;
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
    return flag;
}

function todaysDate() {
    var d = new Date();
    //check month
    var month = ((d.getMonth() + 1) < 10) ? true : false;
    if (month == true) month = "0" + (d.getMonth() + 1);
    else month = d.getMonth() + 1;
    // check date
    var date = (d.getDate() < 10) ? true : false;
    if (date == true) date = "0" + d.getDate();
    else date = d.getDate();
    $('.dateOfEntry')
        .val(date + "-" + month + "-" + d.getFullYear());
}
/*Checking the value of data functions are present here*/
// Function to check if date is valid or not begins
function checkDate(date) {
    if (date == null || date == undefined || date == "") return true;
    else return false;
}
//function ends
function isValidDate(date) {
    var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var d = matches[2];
    var m = matches[1] - 1;
    var y = matches[3];
    var composedDate = new Date(y, m, d);
    return composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
}
// Function to check if unit is valid or not begins
function checkUnit(unit) {
    if (unit == null || unit == undefined || unit == "") return true;
    else return false;
}
// Function to check if item name is valid or not begins
function checkItem(name) {
    if (name == null || name == undefined || name == "") return true;
    else return false;
}
//function ends
// Function to check if item name is valid or not begins
function checkGroup(group) {
    if (group == null || group == undefined || group == "") return true;
    else return false;
}
//function ends
// Function to check if item name is valid or not begins
function checkBill(bill) {
    if (bill == null || bill == undefined || bill == "") return true;
    else return false;
}
//function ends
// Function to check if item name is valid or not begins
function checkMake(make) {
    if (make == null || make == undefined || make == "") return true;
    else return false;
}
//function ends
// Function to check if quantity number is valid or not begins
function checkNumber(number) {
    if (number == null || number == "" || number == undefined) return true;
    else {
        var convertquantityToString = number.toString();
        if (convertquantityToString.indexOf('.') != convertquantityToString.lastIndexOf('.')) //case check for decimal numbers
            return true;
        else if (convertquantityToString.indexOf('-') != -1) //case check for - sign
            return true;
        else if (convertquantityToString.indexOf('+') != -1) //case check for + sign
            return true;
        else if (convertquantityToString.indexOf('e') != -1 || convertquantityToString.indexOf('E') != -1) //case check for e sign
            return true;
        else return false;
    }
}
//function ends
// Function to check if unit is valid or not begins
function checkWhom(whom) {
    if (whom == null || whom == undefined || whom == "") return true;
    else return false;
}
// Function to check if unit is valid or not begins
function checkPurpose(purpose) {
    if (purpose == null || purpose == undefined || purpose == "") return true;
    else return false;
}
//function ends
function getUnitAndCurrentBalance(inputCheck) {
    let inputToSendViaAjaxPost = "data=" + encodeURIComponent(inputCheck.toLowerCase().trim().replace(/\s\s+/g, ' '));
    let flag = 0;
    $.ajax({
        type: "GET"
        , url: "/getUnitAndCurrentBalance"
        , data: inputToSendViaAjaxPost
        , async: false
        , success: function (result, status, xhr) {
            if (result == "error") flag = 1;
            else {
                $("#row" + keepATrackOfInputsInForm + " td #unit")
                    .html(result.unit);
                $("#row" + keepATrackOfInputsInForm + " td #current")
                    .html(result.balance);
                $("#row" + keepATrackOfInputsInForm + " td #group")
                    .html(result.group);
                flag = 2;
            }
        }
        , error: function (xhr, status, error) {
            flag = 1;
        }
    });
    return flag;
}