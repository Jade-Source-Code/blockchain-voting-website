let t = true;
function navToggle() {
  if (t) {
    t = false;
    openNav();
  } else {
    t = true;
    closeNav();
  }
}
function openNav() {
document.getElementById("myNav").style.height = "180px";
}
function closeNav() {
document.getElementById("myNav").style.height = "0%";
}

function updateDateTime() {
      const now = new Date();
      const options = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          timeZoneName: 'short'
      };
      document.getElementById("datetime").textContent = now.toLocaleDateString('en-US', options);
  }

setInterval(updateDateTime, 1000);

function updateVote() {
    document.getElementById("varChange").textContent = 40;
    setTimeout(function(){
        document.getElementById("varChange").textContent = 41;
    }, 5000);
}

updateVote();