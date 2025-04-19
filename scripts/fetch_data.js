import { animateVoteCount } from "./generic.js";
import { capitalize } from "./generic.js";
import { error_window } from "./generic.js";
import { isMobile } from "./generic.js";

let data_yml = {};
let data_json = {};

let cur;

let currentPos = "partylist";

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
    document.getElementById("datetime").innerHTML = now.toLocaleDateString('en-PH', options);
}

export async function loadData(pos) { // This function allows for the time to be updated and the names and partylists to be updated.
  await fetchData();

  for (let category in data_yml.settings) {
    for (let text in data_yml.settings.texts) {
      document.getElementById(text).innerHTML = data_yml.settings.texts[text];
    }   
    for (let source in data_yml.settings.sources) {
      document.getElementById(source).src = data_yml.settings.sources[source];
    }
  }

  document.getElementById("position_text").innerHTML = capitalize(pos);

  const myNavigation = document.getElementById('myNav');
  myNavigation.innerHTML = '';

  const overlay_content = document.createElement('div');
  overlay_content.className = 'overlay-content';

  const partylistNav = document.createElement('a');
  partylistNav.className = 'line';
  partylistNav.onclick = () => loadData('partylist');
  partylistNav.innerHTML = `
    Party Lists
  `;

  overlay_content.appendChild(partylistNav);

  for (let position in data_json.position) {
    const positionNav = document.createElement('a');
    positionNav.className = 'line';
    positionNav.onclick = () => loadData(position);
    positionNav.innerHTML = `
      ${capitalize(position)}
    `;
    overlay_content.appendChild(positionNav);
  }


  myNavigation.appendChild(overlay_content);

  try {
    try {
      const prvContainer = document.getElementById('candidates_list');
      prvContainer.remove();
    } catch (e) {
      // Silent Catch
    }

    const candidates = document.getElementById('candidates');

    const container = document.createElement('div');
    container.id = 'candidates_list';
    container.className = 'candidates_list';

    if (pos == "partylist") {
      for (const party in data_json.partylists) {
        let count = 0;
        for (const position in data_json.position) {
          for (let index = 0; index < data_json.position[position].candidates.length; index++) {
            const candidateData = data_json.position[position].candidates[index];
            const partylistData = data_json.partylists[candidateData.partylist];
            if (data_json.partylists[party].name == partylistData.name) {
              count = candidateData.voteCount + count;
            }
          }
        }
        const partylistData = data_json.partylists[party];
        let barWidth = "0px"
        if (isMobile) {barWidth = Math.round((count / data_json.settings.partylist_maxvote) * (window.innerWidth / 1.73)) + "px";}
        else {barWidth = Math.round((count / data_json.settings.partylist_maxvote) * 850) + "px";}
        const votePercent = Math.round((count / data_json.settings.partylist_maxvote) * 100);
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'candidate';
        candidateDiv.innerHTML = `
          <div class="candidate_back_bar_white"></div>
          <div class="foreground_bar" style="width: 0px; background-color: ${partylistData.color};"></div>
          <div class="foreground_line"></div>
          <div class="foreground_bar_percent_box" style="background: ${partylistData.color};">
            <div class="foreground_bar_percent_holder" style="background: ${partylistData.color};"></div>
            <div class="candidate_percentage" id="candidate_percentage">${votePercent}</div>
          </div>
          <div class="foreground_bar_text_box" style="background: ${partylistData.color};">
            <div class="foreground_bar_text_holder" style="background: ${partylistData.color};"></div>
            <div class="candidate_name_and_party_name">
              <span>
                <span class="candidate_name">${partylistData.name}<br/></span>
                <span class="candidate_party_name">Total Count</span>
              </span>
            </div>
          </div>
        `;
        container.appendChild(candidateDiv);
        
        setTimeout(() => {
          const bar = candidateDiv.querySelector('.foreground_bar');
          bar.style.width = `${barWidth}`;
          const percentage = candidateDiv.querySelector('.candidate_percentage');
          percentage.innerHTML = animateVoteCount(percentage, votePercent, 100, "%")
        }, 50);
      };

      const containerBox = document.getElementById('candidates_bottom_back_bar_white');
      const containerBoxesDiv = document.getElementById('candidates_boxes');
      containerBoxesDiv.innerHTML = '';

      for (const party in data_json.partylists) {
        let count = 0;
        for (const position in data_json.position) {
          for (let index = 0; index < data_json.position[position].candidates.length; index++) {
            const candidateData = data_json.position[position].candidates[index];
            const partylistData = data_json.partylists[candidateData.partylist];
            if (data_json.partylists[party].name == partylistData.name) {
              count = candidateData.voteCount + count;
            }
          }
        }
        const partylistData = data_json.partylists[party];
        const candidateBoxDiv = document.createElement('div');
        candidateBoxDiv.className = 'candidate_stats';
        candidateBoxDiv.innerHTML = `
          <div class="candidate_box" style="background: ${partylistData.color};"></div>
          <div class="candidate_stats_percentage">0%</div>
          <div class="candidate_stats_counter">0 / 0</div>
        `;

        containerBoxesDiv.appendChild(candidateBoxDiv);
        containerBox.appendChild(containerBoxesDiv);

        setTimeout(() => {
          const percentageBox = candidateBoxDiv.querySelector('.candidate_stats_percentage');
          percentageBox.innerHTML = animateVoteCount(percentageBox, Math.round((count / data_json.settings.partylist_maxvote) * 100), 100, "%[]")
          const counterBox = candidateBoxDiv.querySelector('.candidate_stats_counter');
          counterBox.innerHTML = animateVoteCount(counterBox, count, data_json.settings.partylist_maxvote, "/")
        }, 50);
      };
      
      candidates.appendChild(container);
      
      candidates.appendChild(containerBox);
    }
    else {
      for (let index = 0; index < data_json.position[pos].candidates.length; index++) {
        const candidateData = data_json.position[pos].candidates[index];
        const partylistData = data_json.partylists[candidateData.partylist];
        let barWidth = "0px"
        if (isMobile) {barWidth = Math.round((candidateData.voteCount / data_json.settings.candidate_maxvote) * (window.innerWidth / 1.73)) + "px";}
        else {barWidth = Math.round((candidateData.voteCount / data_json.settings.candidate_maxvote) * 850) + "px";}
        const votePercent = Math.round((candidateData.voteCount / data_json.settings.candidate_maxvote) * 100);
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'candidate';
        candidateDiv.innerHTML = `
          <div class="candidate_back_bar_white"></div>
          <div class="foreground_bar" style="width: 0px; background-color: ${partylistData.color};"></div>
          <div class="foreground_line"></div>
          <div class="foreground_bar_percent_box" style="background: ${partylistData.color};">
            <div class="foreground_bar_percent_holder" style="background: ${partylistData.color};"></div>
            <div class="candidate_percentage" id="candidate_percentage">${votePercent}</div>
          </div>
          <div class="foreground_bar_text_box" style="background: ${partylistData.color};">
            <div class="foreground_bar_text_holder" style="background: ${partylistData.color};"></div>
            <div class="candidate_name_and_party_name">
              <span>
                <span class="candidate_name">${candidateData.name}<br/></span>
                <span class="candidate_party_name">${partylistData.name}</span>
              </span>
            </div>
          </div>
        `;
        container.appendChild(candidateDiv);
        
        setTimeout(() => {
          const bar = candidateDiv.querySelector('.foreground_bar');
          bar.style.width = `${barWidth}`;
          const percentage = candidateDiv.querySelector('.candidate_percentage');
          percentage.innerHTML = animateVoteCount(percentage, votePercent, 100, "%")
        }, 50);
      };

      const containerBox = document.getElementById('candidates_bottom_back_bar_white');
      const containerBoxesDiv = document.getElementById('candidates_boxes');
      containerBoxesDiv.innerHTML = '';

      for (let index = 0; index < data_json.position[pos].candidates.length; index++) {
        const candidateData = data_json.position[pos].candidates[index];
        const partylistData = data_json.partylists[candidateData.partylist];
        const votePercent = Math.round((candidateData.voteCount / data_json.settings.candidate_maxvote) * 100);
        const candidateBoxDiv = document.createElement('div');
        candidateBoxDiv.className = 'candidate_stats';
        candidateBoxDiv.innerHTML = `
          <div class="candidate_box" style="background: ${partylistData.color};"></div>
          <div class="candidate_stats_percentage">0%</div>
          <div class="candidate_stats_counter">0 / 0</div>
        `;

        containerBoxesDiv.appendChild(candidateBoxDiv);
        containerBox.appendChild(containerBoxesDiv);

        setTimeout(() => {
          const percentageBox = candidateBoxDiv.querySelector('.candidate_stats_percentage');
          percentageBox.innerHTML = animateVoteCount(percentageBox, votePercent, 100, "%[]")
          const counterBox = candidateBoxDiv.querySelector('.candidate_stats_counter');
          counterBox.innerHTML = animateVoteCount(counterBox, candidateData.voteCount, data_json.settings.candidate_maxvote, "/")
        }, 50);
      }
      
      candidates.appendChild(container);
      
      candidates.appendChild(containerBox);
    }
  } catch (e) {
    console.log("Error fetching data: ", e);
    error_window(e);
  }

  if (cur == pos) {
    cur = pos;
  }

  currentPos = pos;

  updateDateTime();
}

window.loadData = loadData;

export async function fetchData() {
  try {
    const response = await fetch('config.yml');
    const text = await response.text();
    data_yml = jsyaml.load(text);
  } catch (error) {
    data_yml = null;
    console.error('Error loading Data:', error);
    error_window(error);
  }
  try {
    const jsonResponse = await fetch('result.json');
    data_json = await jsonResponse.json();
  } catch (error) {
    data_json = null;
    console.error('Error loading Data:', error);
    error_window(error);
  }
}