export function sayHi() {
  console.log("hello");
}

const partyForm = document.querySelector(".party-form");
partyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchData("join-party").then((result) => {
    console.log(result);
  });
});

const scoreForm = document.querySelector(".score-form");
scoreForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

async function fetchData(endpoint) {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

console.log("leaderboard module");
