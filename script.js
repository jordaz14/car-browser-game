console.log("Welcome to Traffic Game.");

const playContainer = document.querySelector(".play-container");
console.log(playContainer);

const notifySign = document.querySelector(".notify-sign");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
  signImageNotify;
  signImagePlay;
}

const signImageNotify = document.createElement("img");

signImageNotify.src = `./assets/signs/image_${getRandomInt(1, 515)}.png`;

signImageNotify.alt = "Traffic sign";

const signImagePlay = signImageNotify.cloneNode(true);

notifySign.appendChild(signImageNotify);
playContainer.appendChild(signImagePlay);

signImage.src = `./assets/signs/image_${getRandomInt(1, 515)}.png`;

const numSigns = 10;

let imgList = [];

for (i = 0; i < numSigns; i++) {
  const newSign = document.createElement("img");
  newSign.src = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
  playContainer.appendChild(newSign);
}
