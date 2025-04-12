let t = true;
let cur;

let currentPos;

let debugMode = false;

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
      if (pos == "partylist") { // This easily just fetches the partylist names
        for (let i = 1; i < 4; i++) {
          document.getElementById("candidate_"+ i + "_name").innerHTML = data.partylists[i - 1] + "<br/>";
          document.getElementById("candidate_" + i + "_partylist").innerHTML = "Total Count";
        }
      } else if (pos == position) {
        for (let i = 1; i < 4; i++) {
          document.getElementById("candidate_"+ i + "_name").innerHTML = data.position[position].candidates[i - 1].name + "<br/>";
          document.getElementById("candidate_" + i + "_partylist").innerHTML = data.position[position].candidates[i - 1].partylist + "<br/>";
        }
      }
    }

  } catch (error) {
    if (debugMode) console.error('Error loading YAML:', error);
  }
  currentPos = pos;

  try {
    fetch("formatted_result_data.json")
      .then(res => res.json())
      .then(data => {
        if (debugMode) console.log("Data from Flask:", data);

        let count = 0;

        for (position in data.position) {
          if (pos == "partylist") { // This easily just fetches the partylist names
            for (let i = 1; i < 4; i++) {
              for (position in data.position) {
                count = data.position[position].candidates[i - 1].voteCount + count;
              }
              console.log(count);
              document.getElementById("candidate_" + i + "_votecount").innerHTML = count;
              document.getElementById("foreground_bar_" + i).style.width = Math.round((count / 30000) * 850) + "px";
              document.getElementById("candidate_" + i + "_votecount_percentage").innerHTML = Math.round((count / 30000) * 100) + "%";
              document.getElementById("candidate_" + i + "_votecount_percentage_box").innerHTML = Math.round((count / 30000) * 100) + "%";
              count = 0;
            }
          } else if (currentPos == position) {
            for (let i = 1; i < 4; i++) {
              document.getElementById("candidate_" + i + "_votecount").innerHTML = data.position[position].candidates[i - 1].voteCount;
              document.getElementById("foreground_bar_" + i).style.width = Math.round((data.position[position].candidates[i - 1].voteCount / 2000) * 850) + "px";
              document.getElementById("candidate_" + i + "_votecount_percentage").innerHTML = Math.round((data.position[position].candidates[i - 1].voteCount / 2000) * 100) + "%";
              document.getElementById("candidate_" + i + "_votecount_percentage_box").innerHTML = Math.round((data.position[position].candidates[i - 1].voteCount / 2000) * 100) + "%";
            }
          }
        }
      })
      .catch(err => console.error("Error fetching JSON:", err));
  } catch (e) {
    if (debugMode) console.error('Error fetching result:', error);
  }

  updateDateTime();
  if (debugMode) console.log("Data has been updated.");
}

loadYAML("partylist");
setInterval(loadYAML, 60000);


