console.log("Welcome to Traffic Game.");

const playContainer = document.querySelector(".play-container");
console.log(playContainer);

const notifySign = document.querySelector(".notify-sign");
const signImageNotify = document.createElement("img");
//const signImagePlay = signImageNotify.cloneNode(true);
notifySign.appendChild(signImageNotify);

let notifySrc = '';
let numSigns = 10;
var roundNumber = 0;


//playContainer.appendChild(signImagePlay);
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
    newWaldo();
    populateGame();
}

function newWaldo() {
    notifySrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
    signImageNotify.src = notifySrc;
    //signImagePlay.src = newSrc;
    signImageNotify.alt = "Traffic sign";

}

function populateGame() {
    playContainer.innerHTML = '';

    let imgList = [];
    
    //getting random image sources and appending to a list
    for (i = 0; i < numSigns; i++) {
        let newSignSrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
        imgList.push(newSignSrc);
    }
    //add Waldo image
    let notifyLoc = getRandomInt(0, numSigns)
    imgList.splice(notifyLoc,0, notifySrc);

    //populate container
    for (i = 0; i < imgList.length; i++){
        const newSign = document.createElement("img");
        newSign.src = imgList[i];
        if (i == notifyLoc){
            newSign.addEventListener('click', ()=> updateUI());
        }
        playContainer.appendChild(newSign);
    }


    numSigns += 3;

    roundNumber++;
    var element = document.getElementById("roundCounter");
    element.textContent = "Round " + roundNumber;

}

//signImagePlay.addEventListener('click', ()=> updateUI());

updateUI();



//signImage.src = `./assets/signs/image_${getRandomInt(1, 515)}.png`;


