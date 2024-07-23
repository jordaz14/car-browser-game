console.log("Welcome to Traffic Game.");

const playContainer = document.querySelector(".play-container");
const notifySign = document.querySelector(".notify-sign");
const signImageNotify = document.createElement("img");
const roundCounter = document.getElementById("roundCounter");

notifySign.appendChild(signImageNotify);

let notifySrc = "";
let numSigns = 10;
let roundNumber = 0;
const MAXROUNDS = 10;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playRound() {
  if (roundNumber > MAXROUNDS - 1) {
    alert("Game Over");
  } else {
    newWaldo();
    populateGame();
  }
}

function newWaldo() {
  notifySrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
  signImageNotify.src = notifySrc;
  signImageNotify.alt = "Traffic sign";
}

function populateGame() {
  // Clear play container every round
  playContainer.innerHTML = "";

  // Set empty list of img sources every round
  let imgList = [];

  // Push random img src from assets to imgList
  for (i = 0; i < numSigns; i++) {
    let newSignSrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;

    // Enusre that new image added is not the same as as notify image
    if (newSignSrc != notifySrc) {
      imgList.push(newSignSrc);
    }
  }

  // Insert notify image src to random location in imgList
  let notifyLoc = getRandomInt(0, numSigns);
  imgList.splice(notifyLoc, 0, notifySrc);

  // Populate play container with traffic signs
  for (i = 0; i < numSigns; i++) {
    const newSign = document.createElement("img");
    newSign.src = imgList[i];

    if (i == notifyLoc) {
      newSign.addEventListener("click", () => playRound());
    } else {
      newSign.addEventListener("click", () => alert("Game Over"));
    }

    playContainer.appendChild(newSign);
  }

  numSigns += 3;

  roundNumber++;

  roundCounter.textContent = `Round ${roundNumber}`;
}

playRound();
