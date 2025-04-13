let t = true;
let cur;

let currentPos = "partylist";
let data_yml = {};
let data_json = {};

let debugMode = false;

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str)
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
if (isMobile) {
  document.getElementById("main-style").href = "stylesheets/mobile.css";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function navToggle() { // This function is to set true or false for the overlay to show or not
  if (t) {
    t = false;
    if (isMobile) {document.getElementById("myNav").style.height = "325px";}
    else {document.getElementById("myNav").style.height = "clamp(325px, 70vh, 520px)";}
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

async function loadData(pos) { // This function allows for the time to be updated and the names and partylists to be updated.
  await fetchData();

  if (cur == pos) {
    cur = pos;
  }

  document.getElementById("position_text").innerHTML = capitalize(pos);

  for (category in data_yml.settings) {
    for (text in data_yml.settings.texts) {
      document.getElementById(text).innerHTML = data_yml.settings.texts[text];
    }   
    for (source in data_yml.settings.sources) {
      document.getElementById(source).src = data_yml.settings.sources[source];
    }
  }

  for (position in data_yml.position) { // This for loops allows for a easier integration of updating the names and partylists
    if (pos == "partylist") { // This easily just fetches the partylist names
      for (let i = 1; i < 4; i++) {
        document.getElementById("candidate_"+ i + "_name").innerHTML = data_yml.partylists[i - 1] + "<br/>";
        document.getElementById("candidate_" + i + "_partylist").innerHTML = "Total Count";
      }
    } else if (pos == position) {
      for (let i = 1; i < 4; i++) {
        document.getElementById("candidate_"+ i + "_name").innerHTML = data_yml.position[position].candidates[i - 1].name + "<br/>";
        document.getElementById("candidate_" + i + "_partylist").innerHTML = data_yml.position[position].candidates[i - 1].partylist + "<br/>";
      }
    }
  }

  currentPos = pos;
  let count = 0;

  for (position in data_json.position) {
    if (pos == "partylist") { // This easily just fetches the partylist names
      for (let i = 1; i < 4; i++) {
        for (position in data_json.position) {
          count = data_json.position[position].candidates[i - 1].voteCount + count;
        }
        animateVoteCount(i, count, 30000, "/");
        if (isMobile) {document.getElementById("foreground_bar_" + i).style.width = Math.round((count / 30000) * 245) + "px";}
        else {document.getElementById("foreground_bar_" + i).style.width = Math.round((count / 30000) * 850) + "px";}
        animateVoteCount(i, Math.round((count / 30000) * 100), 100, "%");
        animateVoteCount(i, Math.round((count / 30000) * 100), 100, "%[]");
        count = 0;
      }
    } else if (currentPos == position) {
      for (let i = 1; i < 4; i++) {
        animateVoteCount(i, data_json.position[position].candidates[i - 1].voteCount, 2000, "/");
        if (isMobile) {document.getElementById("foreground_bar_" + i).style.width = Math.round((data_json.position[position].candidates[i - 1].voteCount / 2000) * 245) + "px";}
        else {document.getElementById("foreground_bar_" + i).style.width = Math.round((data_json.position[position].candidates[i - 1].voteCount / 2000) * 850) + "px";}
        animateVoteCount(i, Math.round((data_json.position[position].candidates[i - 1].voteCount / 2000) * 100), 100, "%");
        animateVoteCount(i, Math.round((data_json.position[position].candidates[i - 1].voteCount / 2000) * 100), 100, "%[]");
      }
    }
  }

  updateDateTime();
  if (debugMode) console.log("Data has been updated.");
}

async function fetchData() {
  try {
    const response = await fetch('config.yml');
    const text = await response.text();
    data_yml = jsyaml.load(text);
    
    const jsonResponse = await fetch("result.json");
    data_json = await jsonResponse.json();

  } catch (error) {
    console.error('Error loading Data:', error);
  }
}

function animateVoteCount(i, targetCount, length, context) {
  let current = 0;
  const duration = 500;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * targetCount);

    if (context == "/") {
      document.getElementById("candidate_" + i + "_votecount").innerHTML =
        value.toLocaleString() + " / " + (length).toLocaleString();
    } else if (context == "%") {
      document.getElementById("candidate_" + i + "_votecount_percentage").innerHTML =
        value.toLocaleString() + "%";
    } else if (context == "%[]") {
      document.getElementById("candidate_" + i + "_votecount_percentage_box").innerHTML =
        value.toLocaleString() + "%";
    }
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


fetchData();
loadData("partylist");
setInterval(() => loadData(currentPos), 60000);