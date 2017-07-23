document.getElementById("navigation")
.innerHTML = `
<div class="navbar  navbar-inverse  navbar-default navbar-fixed-top" role="navigation">
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
            <li id="add_new_roll">
               <a href="/workrollSection/addNewWorkRoll">Add New Roll</a>
            </li>
            <li id="add_new_roll_entry">
               <a href="/workrollSection/addWorkRollEntry">Add New Roll Entry</a>
            </li>
            <li id="view_work_roll">
               <a href="/workrollSection/viewWorkRoll">View Roll Details</a>
            </li>
            <li  id="change_roll_status">
               <a href="#" class="dropdown-toggle" data-toggle="dropdown">Change Roll Status<b class="caret"></b></a>
               <ul class="dropdown-menu">
                <li class="dropdown-submenu">
                  <li>
                     <a href="/workrollSection/changeRollStatus?status=old">Make New Roll Old</a>
                  </li>
                  <li>
                     <a href="/workrollSection/changeRollStatus?status=new">Make Old Roll New</a>
                  </li>
                  </li>
               </ul>
            </li>
            <li id="view_old_roll">
               <a href="/workrollSection/viewOldWorkRoll">View Old Rolls</a>
            </li>
            <li>
              <a href="#" onclick="printPage()">Print</a>
            </li>
         </ul>
         <ul class="nav navbar-nav navbar-right">
            <li><a href="#" style="color:yellow;cursor:default;"><span class="glyphicon glyphicon-cog"></span>&nbsp;&nbsp;Work Roll Section</a></li>
          </ul>
      </div>
   </div>
</div>`;
