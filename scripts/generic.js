let t = true;
let cur;

function navToggle() {
  if (t) {
    t = false;
    document.getElementById("myNav").style.height = "clamp(330px, 70vh, 520px)";
  } else {
    t = true;
    document.getElementById("myNav").style.height = "0%";
  }
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

async function loadYAML(pos) {
  try {
    const response = await fetch('datasheet.yml');
    const text = await response.text();
    const data = jsyaml.load(text);
    if (cur == pos) {
      cur = pos;
    }
    if (pos == 'president') {
      for (let i = 1; i < 4; i++) {
        document.getElementById("candidate_"+ i + "_name").innerHTML = data["president"].candidates[i - 1].name + "<br/>";
        document.getElementById("candidate_" + i + "_partylist").innerHTML = data["president"].candidates[i - 1].partylist + "<br/>";
      }
    }
    else if (pos == 'vice-president') {
      for (let i = 1; i < 4; i++) {
        document.getElementById("candidate_"+ i + "_name").innerHTML = data["vice-president"].candidates[i - 1].name + "<br/>";
        document.getElementById("candidate_" + i + "_partylist").innerHTML = data["vice-president"].candidates[i - 1].partylist + "<br/>";
      }
    }
  } catch (error) {
    console.error('Error loading YAML:', error);
  }
}

setInterval(loadYAML, 5000);
