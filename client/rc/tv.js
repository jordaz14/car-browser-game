console.log("Hello world");

const tbody = document.querySelector("tbody");
const url = "https://traffic-browser-game-b0ad.onrender.com/";

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

refreshLeaderboard(`/12`);

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
