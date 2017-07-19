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
            <li id="update_name">
               <a href="#" class="dropdown-toggle" data-toggle="dropdown">Update Name<b class="caret"></b></a>
               <ul class="dropdown-menu">
                  <li class="dropdown-submenu">
                  <li> <a href="/updateEntry/updateName?type=m_no">Update Machine's Name</a> </li>
                  <li> <a href="/updateEntry/updateName?type=roll">Update Work Roll's Name</a> </li>
                  </li>
               </ul>
            </li>
            <li id="delete_name">
               <a href="#" class="dropdown-toggle" data-toggle="dropdown">Delete Name<b class="caret"></b></a>
               <ul class="dropdown-menu">
                  <li class="dropdown-submenu">
                  <li> <a href="/updateEntry/deleteName?type=m_no">Delete Machine</a> </li>
                  <li> <a href="/updateEntry/deleteName?type=roll">Delete Work Roll</a> </li>
                  </li>
               </ul>
            </li>
            <li id="update_entry">
               <a href="#" class="dropdown-toggle" data-toggle="dropdown">Update Entry<b class="caret"></b></a>
               <ul class="dropdown-menu">
                  <li class="dropdown-submenu">
                  <li> <a href="/updateEntry/updateExistingEntry?type=m_no">Update Machine's Entry</a> </li>
                  <li> <a href="/updateEntry/updateExistingEntry?type=roll">Update Work Roll's Entry</a> </li>
                  </li>
               </ul>
            </li>
            <li id="delete_entry">
               <a href="#" class="dropdown-toggle" data-toggle="dropdown">Delete Entry<b class="caret"></b></a>
               <ul class="dropdown-menu">
                  <li class="dropdown-submenu">
                  <li> <a href="/updateEntry/deleteExistingEntry?type=m_no">Delete Machine's Entry</a> </li>
                  <li> <a href="/updateEntry/deleteExistingEntry?type=roll">Delete Work Roll's Entry</a> </li>
                  </li>
               </ul>
            </li>
            <li>
              <a href="#" onclick="printPage()">Print</a>
            </li>
         </ul>
         <p class="navbar-text" style="color:blue;">Update Entry <span class="glyphicon glyphicon-user"></span></p>
      </div>
   </div>
</div>
`;
