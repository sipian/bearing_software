
$(function() {

        const title = '<span class="glyphicon glyphicon-exclamation-sign" style="color:#ffaf1d;"></span> Warning'; 

        if($('form').find('input#m_no').length)
          $('form').find('input#m_no').popover({title: title, content: "Machine Name cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#dateOfEntry').length)
          $('form').find('input#dateOfEntry').popover({title: title, content: "Date Cannot Be Left Empty.<br>Date Should be within<br> 02/01/2000 & 02/01/9999." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#dia').length)
          $('form').find('input#dia').popover({title: title, content: "Diameter cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#comment').length)
          $('form').find('input#comment').popover({title: title, content: "Comment cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#make').length)
          $('form').find('input#make').popover({title: title, content: "Make cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#startingDate').length)
          $('form').find('input#startingDate').popover({title: title, content: "Starting Date Cannot Be Left Empty.<br>Date Should be within<br> 02/01/2000 & 02/01/9999." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#endingDate').length)
          $('form').find('input#endingDate').popover({title: title, content: "Ending Date Cannot Be Left Empty.<br>Date Should be within<br> 02/01/2000 & 02/01/9999." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#roll').length)
          $('form').find('input#roll').popover({title: title, content: "Work Roll Name cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 

        if($('form').find('input#m_up').length)
          $('form').find('input#m_up').popover({title: title, content: "Machine Up Date Cannot Be Left Empty.<br>Date Should be within<br> 02/01/2000 & 01/01/9999." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#m_down').length)
          $('form').find('input#m_down').popover({title: title, content: "Machine Down Date Cannot Be Left Empty.<br>Date Should be within<br> 02/01/2000 & 01/01/9999.<br>Machine Down Time Should be More Than Machine Up Time" , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#reason').length)
          $('form').find('input#reason').popover({title: title, content: "Reason cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#g_stime').length)
          $('form').find('input#g_stime').popover({title: title, content: "Grinding Starting Date Cannot Be Left Empty.<br>Date Should be within<br> 02/01/2000 & 01/01/9999.<br>Grinding Start Time Should be More Than Machine Down Time" , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#g_time').length)
          $('form').find('input#g_time').popover({title: title, content: "Grinding Ending Date Cannot Be Left Empty.<br>Date Should be within<br> 02/01/2000 & 01/01/9999.<br>Grinding Ending Time Should be More Than Grinding Start Time" , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#operator').length)
          $('form').find('input#operator').popover({title: title, content: "Grinding Operator cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#name').length)
          $('form').find('input#name').popover({title: title, content: "Name cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#type').length)
          $('form').find('input#type').popover({title: title, content: "Type cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#status').length)
          $('form').find('input#status').popover({title: title, content: "Status cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#oldname').length)
          $('form').find('input#oldname').popover({title: title, content: "Old Name cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
        if($('form').find('input#index').length)
          $('form').find('input#index').popover({title: title, content: "Index cannot be left empty." , trigger: "manual", html: true, placement: 'bottom'}); 
        
          $(document).mouseup(function(e) {
            if ($('form').find('input#m_no').length && $('form').find('input#m_no').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#m_no').popover('hide');

            if ($('form').find('input#dia').length && $('form').find('input#dia').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#dia').popover('hide');
            
            if ($('form').find('input#comment').length && $('form').find('input#comment').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#comment').popover('hide');
            
            if ($('form').find('input#dateOfEntry').length && $('form').find('input#dateOfEntry').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#dateOfEntry').popover('hide');
            
            if ($('form').find('input#roll').length && $('form').find('input#roll').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#roll').popover('hide');
            
            if ($('form').find('input#make').length && $('form').find('input#make').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#make').popover('hide');
            
            if ($('form').find('input#startingDate').length && $('form').find('input#startingDate').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#startingDate').popover('hide');
           
            if ($('form').find('input#endingDate').length && $('form').find('input#endingDate').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#endingDate').popover('hide');

            if ($('form').find('input#m_up').length && $('form').find('input#m_up').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#m_up').popover('hide');

            if ($('form').find('input#m_down').length && $('form').find('input#m_down').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#m_down').popover('hide');

            if ($('form').find('input#reason').length && $('form').find('input#reason').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#reason').popover('hide');

            if ($('form').find('input#g_stime').length && $('form').find('input#g_stime').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#g_stime').popover('hide');
              
            if ($('form').find('input#g_time').length && $('form').find('input#g_time').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#g_time').popover('hide');

            if ($('form').find('input#operator').length && $('form').find('input#operator').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#operator').popover('hide');

            if ($('form').find('input#name').length && $('form').find('input#name').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#name').popover('hide');

            if ($('form').find('input#type').length && $('form').find('input#type').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#type').popover('hide');
            
            if ($('form').find('input#status').length && $('form').find('input#status').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#status').popover('hide');
            
            if ($('form').find('input#oldname').length && $('form').find('input#oldname').data()['bs.popover'].tip().hasClass('in'))
                $('form').find('input#oldname').popover('hide');
             
            if ($('form').find('input#index').length && $('form').find('input#index').data()['bs.popover'].tip().hasClass('in'))
               $('form').find('input#index').popover('hide');
                     
          });

          $("table").attr("class", "table table-condensed table-bordered table-striped");
 // datetimepicker gives date in dd/mm/yyyy hh:mm pm

   if($('#m_up').length) {
      $('#m_up').datetimepicker({ 
             beforeShow: function (input, inst) {
              setTimeout(function () {
              inst.dpDiv.css({
                  top: $("#m_up").offset().top + 35,
                  left: $("#m_up").offset().left
              });
              }, 0);
            },
            dateFormat: 'dd/mm/yy',
            timeFormat: 'hh:mm tt',
            controlType: 'select',
            oneLine: true,
        });
   }
   
  if($('#m_down').length) {
      $('#m_down').datetimepicker({ 
             beforeShow: function (input, inst) {
              setTimeout(function () {
              inst.dpDiv.css({
                  top: $("#m_down").offset().top + 35,
                  left: $("#m_down").offset().left
              });
              }, 0);
            },
            dateFormat: 'dd/mm/yy',
            timeFormat: 'hh:mm tt',
            controlType: 'select',
            oneLine: true,
        });
   }

   if($('#g_stime').length) {
      $('#g_stime').datetimepicker({ 
             beforeShow: function (input, inst) {
              setTimeout(function () {
              inst.dpDiv.css({
                  top: $("#g_stime").offset().top + 35,
                  left: $("#g_stime").offset().left
              });
              }, 0);
            },
            dateFormat: 'dd/mm/yy',
            timeFormat: 'hh:mm tt',
            controlType: 'select',
            oneLine: true,
        });
   }

   if($('#g_time').length) {
      $('#g_time').datetimepicker({ 
             beforeShow: function (input, inst) {
              setTimeout(function () {
              inst.dpDiv.css({
                  top: $("#g_time").offset().top + 35,
                  left: $("#g_time").offset().left
              });
              }, 0);
            },
            dateFormat: 'dd/mm/yy',
            timeFormat: 'hh:mm tt',
            controlType: 'select',
            oneLine: true,
        });
   }

   if($("#dateOfEntry").length) {
    $("#dateOfEntry").datepicker({dateFormat: 'dd/mm/yy'});
   }

   if($("#startingDate").length) {
    $("#startingDate").datepicker({dateFormat: 'dd/mm/yy'});
   }

   if($("#endingDate").length) {
    $("#endingDate").datepicker({dateFormat: 'dd/mm/yy'});
   }
   
});

function isValidDate(a) {
  d = new Date(a);
  if ( Object.prototype.toString.call(d) === "[object Date]" ) {
    if ( isNaN( d.getTime() ) )
      return false;
    else
      return true;
  }
  else
    return false;
}

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

function checkIfMachineExists(inputCheck, e , giveErrorOnExists, askCofirmation = false) {
    if(!inputCheck){
      $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Enter Machine Name.</div>`);
      e.preventDefault();
      return;
    }
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
              } else if(askCofirmation) {
                if(!confirm("Are You sure You Want To Update Entry? Once It Is Updated It Cannot Be Restored !!"))
                    e.preventDefault();
            }
        } else {
            if(result === "doesNotexist") {
              $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Machine With The Given Name Does Not Exist</div>`);
              e.preventDefault();
            } else if(askCofirmation) {
                if(!confirm("Are You sure You Want To Update Entry? Once It Is Updated It Cannot Be Restored !!"))
                    e.preventDefault();
            }
          }
      })
    .fail(function(x) {
      $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Some error occured while fetching the data.<br>Reload The Page And Try Again.</div>`);
        e.preventDefault();
    });
}

function checkIfWorkRollExists(inputCheck, e , giveErrorOnExists, st = "both", askCofirmation = false) {
  if(!inputCheck){
    $("#message").html(`<div class="alert alert-danger alert-dismissable fade in"><a aria-label=close class=close data-dismiss=alert href=#>×</a> <strong>ERROR!</strong> Enter Work Roll Name.</div>`);
    e.preventDefault();
    return;
  }
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
            } else if(askCofirmation) {
                if(!confirm("Are You sure You Want To Update Entry? Once It Is Updated It Cannot Be Restored !!"))
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
            } else if(askCofirmation) {
                if(!confirm("Are You sure You Want To Update Entry? Once It Is Updated It Cannot Be Restored !!"))
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
$(function() {
  $("[rel=tooltip]").tooltip();
});
