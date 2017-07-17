function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function printPage() {
    window.print();
}

function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}

/* ************************************ */
/* MACHINE'S DATALIST */

function dataListForMachineName() {
    $.ajax({
        type: "GET",
        url: "/datalist/machine_no",
        success: function (result, status, xhr) {
            if (result === "error") {
              alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
              window.location.replace("/machineSection");
            }
            else {
                $(".m_no").autocomplete({
                        source: result,
                        autoFocus: true
                    });
            }
        },
         error: function (xhr, status, error) {
           alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
           window.location.replace("/machineSection");
        }
    });
}

function dataListForMachineMake() {
    $.ajax({
        type: "GET",
        url: "/datalist/make",
        success: function (result, status, xhr) {
            if (result === "error") {
              alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
              window.location.replace("/machineSection");
            }
            else {
                $(".make").autocomplete({
                        source: remove_duplicates_es6(flatten(result)),
                        autoFocus: true
                    });
              }
        },
         error: function (xhr, status, error) {
           alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
           window.location.replace("/machineSection");
        }
    });
}


/* ************************************ */
/* WORKROLL'S DATALIST */

function dataListForWorkRollName(st) {
    $.ajax({
        type: "GET",
        url: "/datalist/roll",
        data: {
          status : st
        },
        success: function (result, status, xhr) {
            if (result === "error") {
              alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
              window.location.replace("/workrollSection");
            }
            else {
                $(".roll").autocomplete({
                        source: result,
                        autoFocus: true
                    });
            }
        },
         error: function (xhr, status, error) {
           alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
           window.location.replace("/workrollSection");
        }
    });
}

function dataListForWorkRollReason() {
    $.ajax({
        type: "GET",
        url: "/datalist/reason",
        success: function (result, status, xhr) {
            if (result === "error") {
              alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
              window.location.replace("/workrollSection");
            }
            else {
                $(".reason").autocomplete({
                        source: remove_duplicates_es6(flatten(result)),
                        autoFocus: true
                    });
              }
        },
         error: function (xhr, status, error) {
           alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
           window.location.replace("/workrollSection");
        }
    });
}

function dataListForWorkRollOperator() {
    $.ajax({
        type: "GET",
        url: "/datalist/operator",
        success: function (result, status, xhr) {
            if (result === "error") {
              alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
              window.location.replace("/workrollSection");
            }
            else {
                $(".operator").autocomplete({
                        source: remove_duplicates_es6(flatten(result)),
                        autoFocus: true
                    });
              }
        },
         error: function (xhr, status, error) {
           alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
           window.location.replace("/workrollSection");
        }
    });
}

/* ****************************** */
/* CHECKING DATA EXISTENCE FUNCTIONS */

function checkIfMachineExists(inputCheck, e , giveErrorOnExists) {
    $.ajax({
        type: "GET",
        url: "/datalist/checkIfMachineExists",
        data: {
            data: inputCheck
        },
        async: false
    }).done(function(result, status, xhr) {
      if (result === "error") {
        $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Some error occured while fetching the data.<br>Reload The Page And Try Again.</div>`);
          e.preventDefault();
      } else  if (result === "multiple") {
          $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Multiple Entries With The Same Machine Name Exist</div>`);
            e.preventDefault();
        } else if (giveErrorOnExists) {
            if(result === "exists") {
              $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Machine With The Given Name Already Exists</div>`);
              e.preventDefault();
              }
        } else {
            if(result === "doesNotexist") {
              $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Machine With The Given Name Does Not Exist</div>`);
              e.preventDefault();
            }
          }
      })
    .fail(function(x) {
      $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Some error occured while fetching the data.<br>Reload The Page And Try Again.</div>`);
        e.preventDefault();
    });
}

function checkIfWorkRollExists(inputCheck, e , giveErrorOnExists, st = "both") {
    $.ajax({
        type: "GET",
        url: "/datalist/checkIfWorkRollExists",
        data: {
            data: inputCheck
        },
        async: false
    }).done(function(result, status, xhr) {
      if (result === "error") {
        $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Some error occured while fetching the data.<br>Reload The Page And Try Again.</div>`);
          e.preventDefault();
      } else  if (result === "multiple") {
          $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Multiple Entries With The Same Work Roll Name Exist</div>`);
            e.preventDefault();
        } else if (giveErrorOnExists) {
            if(result !== "doesNotexist") {
              $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Work Roll With The Given Name Already Exists</div>`);
              e.preventDefault();
            }
        } else {
            if(result === "doesNotexist") {
              $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Work Roll With The Given Name Does Not Exist</div>`);
              e.preventDefault();
            } else if(st === "old" && result === "exists") {
                $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Work Roll With The Given Name Exists As A New Roll</div>`);
                e.preventDefault();
            } else if(st === "new" && result === "old") {
                $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Work Roll With The Given Name Exists As An Old Roll</div>`);
                e.preventDefault();
            }
          }
      })
    .fail(function(x) {
      $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Some error occured while fetching the data.<br>Reload The Page And Try Again.</div>`);
        e.preventDefault();
    });
}

/* ****************************** */
/* MISCELLANEOS FUNCTIONS */

var currFFZoom = 1;
var currIEZoom = 100;
function plus() {
    var step = 15;
    currFFZoom += step;
    $('body').css('MozTransform', 'scale(' + currFFZoom + ')');
    var stepie = 15;
    currIEZoom += stepie;
    $('body').css('zoom', ' ' + currIEZoom + '%');
}

function minus() {
    var step = 15;
    currFFZoom -= step;
    $('body').css('MozTransform', 'scale(' + currFFZoom + ')');
    var stepie = 15;
    currIEZoom -= stepie;
    $('body').css('zoom', ' ' + currIEZoom + '%');
}

document.getElementById("zoomFeatures")
.innerHTML = `
<div class="" style="position: fixed; left:1%;width: 100%;">
   <a id="minusBtn" onclick="minus()" style="position:fixed;bottom:40px;cursor:pointer;">
     <span class="glyphicon glyphicon-zoom-out" ></span>
   </a>
   <a id="plusBtn" onclick="plus()" style="position:fixed;bottom:0;cursor:pointer;">
     <span class="glyphicon glyphicon-zoom-in"></span>
   </a>
</div>`;
