document.getElementById("navigation")
.innerHTML = `
<div class="navbar navbar-inverse navbar-default navbar-fixed-top" role="navigation">
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
            <li id="add_new_machine">
               <a href="/machineSection/addNewMachine">Add New Machine</a>
            </li>
            <li id="add_new_entry">
               <a href="#" class="dropdown-toggle" data-toggle="dropdown">Add New Entry<b class="caret"></b></a>
               <ul class="dropdown-menu multi-level">
                  <li class="dropdown-submenu">
                     <a href="#" class="dropdown-toggle" data-toggle="dropdown">Add Bearing Entry</a>
                     <ul class="dropdown-menu">
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
                  <li class="dropdown-submenu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Add Back Up Roll Entry</a>
                      <ul class="dropdown-menu">
                        <li class="dropdown-submenu">
                          <li><a href="/machineSection/addMachineBackUpRollEntry?type=1">Back Up Roll Up</a></li>
                          <li><a href="/machineSection/addMachineBackUpRollEntry?type=2">Back Up Roll Down</a></li>
                        </li>
                      </ul>
                  </li>
               </ul>
            </li>
            <!-- View Bearing And back Up roll details-->
            <li  id="view_entry">
               <a href="#" class="dropdown-toggle" data-toggle="dropdown">View Machine Details<b class="caret"></b></a>
               <ul class="dropdown-menu">
                <li class="dropdown-submenu">
                  <li>
                     <a href="/machineSection/viewMachineBearing">View Bearing Details</a>
                  </li>
                  <li>
                     <a href="/machineSection/viewMachineBackUpRoll">View Back Up Roll Details</a>
                  </li>
                  </li>
               </ul>
            </li>
            <li>
              <a href="#" onclick="printPage()">Print</a>
            </li>
         </ul>
         <ul class="nav navbar-nav navbar-right">
            <li><a href="#" style="color:yellow;cursor:default;"><span class="glyphicon glyphicon-hdd"></span>&nbsp;&nbsp;Machine Section</a></li>
          </ul>
      </div>
   </div>
</div>`;