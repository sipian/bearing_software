document.getElementById("navigation")
    .innerHTML = `
<div class="navbar navbar-default navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
       </button>
      <a class="navbar-brand" href="/">HOME</a>
    </div>
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li>
          <a href="/machineSection/addNewMachine">Add New Machine</a>
        </li>
        <li>
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Add New Entry<b class="caret"></b></a>
          <ul class="dropdown-menu multi-level">
            <li class="dropdown-submenu">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Gear Side</a>
              <ul class="dropdown-menu">
                <li class="dropdown-submenu">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Up</a>
                  <ul class="dropdown-menu">
                    <li class="dropdown-submenu">
                      <li><a href="/machineSection/addMachineBearingEntry?type=gui">In</a></li>
                      <li><a href="/machineSection/addMachineBearingEntry?type=guo">Out</a></li>
                    </li>
                  </ul>
                </li>
                <li class="dropdown-submenu">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Down</a>
                  <ul class="dropdown-menu">
                    <li class="dropdown-submenu">
                      <li><a href="/machineSection/addMachineBearingEntry?type=gdi">In</a></li>
                      <li><a href="/machineSection/addMachineBearingEntry?type=gdo">Out</a></li>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li class="dropdown-submenu">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dab Side</a>
              <ul class="dropdown-menu">
                <li class="dropdown-submenu">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Up</a>
                  <ul class="dropdown-menu">
                    <li class="dropdown-submenu">
                      <li><a href="/machineSection/addMachineBearingEntry?type=dui">In</a></li>
                      <li><a href="/machineSection/addMachineBearingEntry?type=duo">Out</a></li>
                    </li>
                  </ul>
                </li>
                <li class="dropdown-submenu">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Down</a>
                  <ul class="dropdown-menu">
                    <li class="dropdown-submenu">
                      <li><a href="/machineSection/addMachineBearingEntry?type=ddi">In</a></li>
                      <li><a href="/machineSection/addMachineBearingEntry?type=ddo">Out</a></li>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <a href="/machineSection/viewMachineBearing">View Machine Details</a>
        </li>
        <li>
          <a href="/machineSection/updateMachineBearingEntry">Update Entry</a>
        </li>
      </ul>
      <p class="navbar-text" style="color:blue;">Machine Section</p>
    </div>
  </div>
</div>`;
