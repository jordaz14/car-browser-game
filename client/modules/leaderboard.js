import { score } from "./score.js";

export function init() {
  console.log("leadership.js init");
}

let activeParty = 1;
const partyNav = document.querySelector("#party-nav");
const leaderboardNotify = document.querySelector("#leaderboard-notify");
const url = "https://traffic-browser-game-b0ad.onrender.com/";
const tbody = document.querySelector("tbody");

function refreshLeaderboard(partyId) {
  tbody.innerHTML = "";
  let rowCounter = 0;
  fetchData("refresh-leaderboard", partyId).then((leaderboard) => {
    console.log(leaderboard);
    for (const entry of leaderboard.data) {
      const newRow = document.createElement("tr");
      rowCounter++;
      for (const data in entry) {
        if (data != "id") {
          const newTableData = document.createElement("td");
          newTableData.textContent = entry[data];
          newRow.appendChild(newTableData);
        }
      }
      const rankTableData = document.createElement("td");
      rankTableData.textContent = rowCounter;
      newRow.appendChild(rankTableData);
      tbody.appendChild(newRow);
    }
  });
}

refreshLeaderboard(`/${activeParty}`);

const partyForm = document.querySelector(".party-form");

partyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const partyFormData = new FormData(partyForm);
  const partyFormObject = Object.fromEntries(partyFormData.entries());
  postData("join-party", { party: partyFormObject.partyname }).then(
    (result) => {
      console.log(result);
      leaderboardNotify.textContent = result.message;
      activeParty = result.data;
      partyNav.textContent = partyFormObject.partyname.toUpperCase();
      refreshLeaderboard(`/${result.data}`);
    }
  );
});

const scoreForm = document.querySelector(".score-form");

scoreForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const scoreFormData = new FormData(scoreForm);
  const scoreFormObject = Object.fromEntries(scoreFormData.entries());
  postData("submit-score", {
    username: scoreFormObject.username,
    partyId: activeParty,
    score: score.active.score,
  }).then((result) => {
    console.log(result);
    leaderboardNotify.textContent = result.message;
    refreshLeaderboard(`/${activeParty}`);
  });
});

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

async function postData(endpoint, data = {}, param = "") {
  const response = await fetch(`${url}${endpoint}${param}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}
