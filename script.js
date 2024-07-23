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

  let imgList = [];

  //getting random image sources and appending to a list
  for (i = 0; i < numSigns; i++) {
    let newSignSrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
    if (newSignSrc != notifySrc) {
      imgList.push(newSignSrc);
    }
  }

  //add Waldo image
  let notifyLoc = getRandomInt(0, numSigns);
  imgList.splice(notifyLoc, 0, notifySrc);

  //populate container
  for (i = 0; i < imgList.length; i++) {
    const newSign = document.createElement("img");
    newSign.src = imgList[i];
    if (i == notifyLoc) {
      newSign.addEventListener("click", () => playRound());
    }
    playContainer.appendChild(newSign);
  }

  numSigns += 3;

  roundNumber++;

  roundCounter.textContent = `Round ${roundNumber}`;
}

playRound();
