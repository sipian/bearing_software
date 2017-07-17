function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}

function dataListForMachineName() {
    $.ajax({
        type: "GET",
        url: "/datalist/machine_no",
        success: function (result, status, xhr) {
            if (result === "error") {
              alert("Some Error Occured While Fetching The Data.\nReloading The Page And Trying It Again");
              window.location.reload();
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
           window.location.reload();
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
              window.location.reload();
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
           window.location.reload();
        }
    });
}

function checkIfMachineExists(inputCheck) {
    return $.ajax({
        type: "GET",
        url: "/datalist/checkIfMachineExists",
        data: {
            data: inputCheck
        },
        async: false
    });
}

function checkIfWorkRollExists(inputCheck) {
    return $.ajax({
        type: "GET",
        url: "/datalist/checkIfWorkRollExists",
        data: {
            data: inputCheck
        }
    });
}

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
