console.log("Welcome to Traffic Game.");

const playContainer = document.querySelector(".play-container");

const notifySign = document.querySelector(".notify-sign");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const signImage = document.createElement("img");

signImage.src = `./assets/signs/image_${getRandomInt(0, 10)}.png`;

signImage.alt = "Traffic sign";

console.log(signImage);

playContainer.appendChild(signImage);
notifySign.appendChild(signImage);
