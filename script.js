console.log("Welcome to Traffic Game.");

const playContainer = document.querySelector(".play-container");
console.log(playContainer);

const signImage = document.createElement("img");
signImage.src = "./assets/signs/image_13.png";
signImage.alt = "Traffic sign";

console.log(signImage);

playContainer.appendChild(signImage);
