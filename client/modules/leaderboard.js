import { score } from "./score.js";

export function init() {
  console.log("leaderboard.js active");
}

const url = "https://traffic-browser-game-b0ad.onrender.com/";
let firstload = true;

const party = {
  activeId: sessionStorage.getItem("cachedPartyId") || 11,
  activeName: sessionStorage.getItem("cachedPartyName") || "GLOBAL",
};

const partyNav = document.querySelector("#party-nav");
partyNav.textContent = `PARTY: ${party.activeName}`;

const leaderboardNotify = document.querySelector("#leaderboard-notify");

const partyNameInput = document.querySelector("#party-form-input");
const usernameInput = document.querySelector("#score-form-input");
usernameInput.value = sessionStorage.getItem("cachedUsername") || "";

// Refresh leaderboard on initial load
refreshLeaderboard(`/${party.activeId}`);

// REFRESHES LEADERBOARD BASED ON PARTY ID
function refreshLeaderboard(activeId) {
  // Clear existing leaderboard table
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  fetchData("refresh-leaderboard", activeId).then((result) => {

    // Clears static 'loading servers' text content
    if (firstload) {
      leaderboardNotify.textContent = "";
      firstload = false;
    }

    let rankCounter = 0;

    // Iterate through every user row in leaderboard
    for (const entry of result.data) {
      rankCounter++;
      const newRow = document.createElement("tr");

      // Iterate through every data cell in user row
      for (const data in entry) {
        const newCell = document.createElement("td");
        newCell.textContent = entry[data];

        newRow.appendChild(newCell);
      }

      // Create additional ranking cell not in original response
      const rankCell = document.createElement("td");
      rankCell.textContent = rankCounter;
      newRow.appendChild(rankCell);

      // Append user row to leaderboard
      tbody.appendChild(newRow);
    }
  });
}

// JOINS OR CREATES PARTY ON PARTY FORM SUBMIT
const partyForm = document.querySelector(".party-form");
partyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Transform score form data to JSON
  const partyFormData = new FormData(partyForm);
  const partyFormJSON = Object.fromEntries(partyFormData.entries());

  // Post party name to endpoint
  postData("join-party", undefined, { party: partyFormJSON.partyname }).then(
    (result) => {
      // Notify user of response & update party text content
      leaderboardNotify.textContent = result.message;
      partyNav.textContent = `PARTY: ${partyFormJSON.partyname.toUpperCase()}`;
      sessionStorage.setItem(
        "cachedPartyName",
        partyFormJSON.partyname.toUpperCase()
      );

      // Update the active party Id
      party.activeId = result.data;
      sessionStorage.setItem("cachedPartyId", party.activeId);
      refreshLeaderboard(`/${party.activeId}`);
    }
  );

  // Clear inputted value from input element
  partyNameInput.value = "";
});

// SENDS USER SCORE TO SERVER ON SCORE FORM SUBMIT
const scoreForm = document.querySelector(".score-form");
scoreForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Transform score form data to JSON
  const scoreFormData = new FormData(scoreForm);
  const scoreFormJSON = Object.fromEntries(scoreFormData.entries());

  // Post username, partyId, & score to endpoint
  postData("submit-score", undefined, {
    username: scoreFormJSON.username,
    partyId: party.activeId,
    score: score.active.score,
  }).then((result) => {
    // Notify user of response
    leaderboardNotify.textContent = result.message;

    // Cache username
    sessionStorage.setItem("cachedUsername", scoreFormJSON.username);

    refreshLeaderboard(`/${party.activeId}`);
  });
});

// HANDLES GET METHOD
async function fetchData(endpoint, param = "") {
  try {
    const response = await fetch(`${url}${endpoint}${param}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

// HANDLES POST METHOD
async function postData(endpoint, param = "", data = {}) {
  const response = await fetch(`${url}${endpoint}${param}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}
