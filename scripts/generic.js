import { loadData } from "./fetch_data.js";
import { fetchData } from "./fetch_data.js";
import { updateDateTime } from "./fetch_data.js";

let navBool = true;

let currentPos = "partylist";

export const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str)
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
if (isMobile) {
  document.getElementById("main-style").href = "stylesheets/mobile.css";
}

export function navToggle() { // This function is to set true or false for the overlay to show or not
  const overlay = document.querySelector('.overlay');
  if (overlay.classList.contains('open')) {
    overlay.style.height = '0px';
    overlay.classList.remove('open');
  } else {
    overlay.style.height = overlay.scrollHeight + 'px';
    overlay.classList.add('open');
  }
}

window.navToggle = navToggle;

export function error_window(e) {
  const candidates = document.getElementById('candidates');
  candidates.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'error_container';
  const candidateDiv = document.createElement('div');
  candidateDiv.className = 'error_window';
    candidateDiv.innerHTML = `
      <div class="error_window_back_bar_white">
          <div class="error_window_text">
          Config or Result's data was not what it was expected
          <br />
          <br />
          Error catch:
          <br />
          ${e}
          </div>
      </div>
    `;
    container.appendChild(candidateDiv);

  candidates.appendChild(container);
}

export function animateVoteCount(path, targetCount, length, context) {
  const duration = 500;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * targetCount);

    if (context == "/") {
      path.innerHTML = value.toLocaleString() + " / " + (length).toLocaleString();
    } else if (context == "%") {
      path.innerHTML = value.toLocaleString() + "%";
    } else if (context == "%[]") {
      path.innerHTML = value.toLocaleString() + "%";
    }
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

await updateDateTime();
await fetchData();
await loadData("partylist");
setInterval(async () => await updateDateTime, 60000 * 5);
setInterval(async () => await loadData(currentPos), 60000 * 5);
setInterval(async () => await fetchData, 60000 * 5);