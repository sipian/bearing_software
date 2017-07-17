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
            <li id="add_new_roll">
               <a href="/workrollSection/addNewWorkRoll">Add New Work Roll</a>
            </li>
            <li id="add_new_roll_entry">
               <a href="/workrollSection/addWorkRollEntry">Add New Work Entry</a>
            </li>
            <li id="make_roll_old">
               <a href="/workrollSection/makeRollOld">Make Work Roll Old</a>
            </li>
            <!-- Update Entries -->
            <li>
               <a href="/machineSection/updateMachineBearingEntry">Update Entry</a>
            </li>
            <li>
              <a href="#" onclick="printPage()">Print</a>
            </li>
         </ul>
         <p class="navbar-text" style="color:blue;">Work Roll Section</p>
      </div>
   </div>
</div>`;
