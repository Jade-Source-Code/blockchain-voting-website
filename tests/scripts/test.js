import { loadData } from "./fetch_data.js";

let t = true;

let currentPos = "partylist";

export const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str)
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
if (isMobile) {
  document.getElementById("main-style").href = "stylesheets/mobile.css";
}

export function navToggle() { // This function is to set true or false for the overlay to show or not
  if (t) {
    t = false;
    if (isMobile) {document.getElementById("myNav").style.height = "325px";}
    else {document.getElementById("myNav").style.height = "clamp(325px, 70vh, 520px)";}
  } else {
    t = true;
    document.getElementById("myNav").style.height = "0%";
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

await loadData("partylist");
setInterval(async () => await loadData(currentPos), 60000 * 5);