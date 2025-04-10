let t = true;
let cur;

let currentPos;

function navToggle() { // This function is to set true or false for the overlay to show or not
  if (t) {
    t = false;
    document.getElementById("myNav").style.height = "clamp(330px, 70vh, 520px)";
  } else {
    t = true;
    document.getElementById("myNav").style.height = "0%";
  }
}

function updateDateTime() { // Updates time with proper formatting and changes the current time in the website.
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

async function loadYAML(pos) { // This function allows for the time to be updated and the names and partylists to be updated.
  try {
    const response = await fetch('datasheet.yml');
    const text = await response.text();
    const data = jsyaml.load(text);
    if (cur == pos) {
      cur = pos;
    }
    for (position in data.position) { // This for loops allows for a easier integration of updating the names and partylists
      if (pos == position) {
        for (let i = 1; i < 4; i++) {
          document.getElementById("candidate_"+ i + "_name").innerHTML = data.position[position].candidates[i - 1].name + "<br/>";
          document.getElementById("candidate_" + i + "_partylist").innerHTML = data.position[position].candidates[i - 1].partylist + "<br/>";
        }
      }
    }
    if (pos == "partylist") { // This easily just fetches the partylist names
      for (let i = 1; i < 4; i++) {
        document.getElementById("candidate_"+ i + "_name").innerHTML = data.partylists[i - 1] + "<br/>";
        document.getElementById("candidate_" + i + "_partylist").innerHTML = "Total Count";
      }
    }
  } catch (error) {
    console.error('Error loading YAML:', error);
  }
  currentPos = pos;

  fetch("http://10.103.156.154:5000/get-results")
    .then(res => res.json())
    .then(data => {
      console.log("Data from Flask:", data);

      const jsonString = JSON.stringify(data, null, 2);

      const blob = new Blob([jsonString], { type: "application/json" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "results.json";  
      document.body.appendChild(a);
      a.click();

      for (position in data.position) {
        if (currentPos == position) {
          for (let i = 1; i < 4; i++) {
            document.getElementById("candidate_" + i + "_votecount").innerHTML = data.position[position].candidates[i - 1].voteCount;
            document.getElementById("foreground_bar_" + i).style.width = Math.round((data.position[position].candidates[i - 1].voteCount / 2000) * 800) + "px";
            document.getElementById("candidate_" + i + "_votecount_percentage").innerHTML = Math.round((data.position[position].candidates[i - 1].voteCount / 2000) * 100) + "%";
            document.getElementById("candidate_" + i + "_votecount_percentage_box").innerHTML = Math.round((data.position[position].candidates[i - 1].voteCount / 2000) * 100) + "%";
          }
        }
      }

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(err => console.error("Error fetching JSON:", err));

  updateDateTime();
  console.log("Data has been updated.");
}

loadYAML("partylist");
setInterval(loadYAML, 60000);


