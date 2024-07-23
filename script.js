console.log("Welcome to Traffic Game.");

const playContainer = document.querySelector(".play-container");
console.log(playContainer);

const notifySign = document.querySelector(".notify-sign");
const signImageNotify = document.createElement("img");
notifySign.appendChild(signImageNotify);

let notifySrc = '';
let numSigns = 10;
var roundNumber = 0;
const maxSignSize = 180;
const maxPlacementAttempts = 1000;

//random int
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextRound() {
    newNotify();
    populateGame();
}

function newNotify() {
    notifySrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
    signImageNotify.src = notifySrc;
    signImageNotify.alt = "Traffic sign";

}
//beta distribution function for placing signs
function betaDistribution(alpha, beta) {
    let u = Math.random();
    let v = Math.random();
    let x = Math.pow(u, 1/alpha);
    let y = Math.pow(v, 1/beta);
    return x / (x + y);
}

//function checking overlapping
function isOverlapping(newPos, newSize, existingPositions) {
    //iterate through existing positions list
    for (let item of existingPositions) {
        if (newPos.x < item.pos.x + item.size.width &&
            newPos.x + newSize.width > item.pos.x &&
            newPos.y < item.pos.y + item.size.height &&
            newPos.y + newSize.height > item.pos.y) {
            return true;
        }
    }
    return false;
}

//random positioning in tightly bound shape
function getPosition(existingPositions, size, allowOverflow) {
    const containerRect = playContainer.getBoundingClientRect();
    const maxX = containerRect.width - size.width;
    const maxY = containerRect.height - size.height;

    for (let attempts = 0; attempts < maxPlacementAttempts; attempts++) {
        let x, y;
        if (allowOverflow) {
            // Allow positions outside the container
            x = (Math.random() * 2 - 0.5) * containerRect.width;
            y = (Math.random() * 2 - 0.5) * containerRect.height;
        } else {
            // Use beta distribution for positions inside the container
            x = betaDistribution(2, 2) * maxX;
            y = betaDistribution(2, 2) * maxY;
        }
        let newPos = { x, y };

        if (!isOverlapping(newPos, size, existingPositions)) {
            return newPos;
        }
    }

    if (!allowOverflow) {
        // If we couldn't place inside, try placing outside
        return getPosition(existingPositions, size, true);
    }

    return null; // Couldn't place even with overflow
}


//making sure image doesnt exceed max w or h 
function scaleImage(img) {
    return new Promise((resolve) => {
        img.onload = () => {
            let width = img.naturalWidth;
            let height = img.naturalHeight;
            let scaleFactor = 1;

            if (width > height && width > maxSignSize) {
                scaleFactor = maxSignSize / width;
            } else if (height > width && height > maxSignSize) {
                scaleFactor = maxSignSize / height;
            }

            width *= scaleFactor;
            height *= scaleFactor;

            resolve({ width, height });
        };
    });
}


async function populateGame() {
    playContainer.innerHTML = '';
    playContainer.style.position = 'relative';

    let imgList = [];
    let positions = [];
    
    //getting random image sources and appending to a list
    let i = 0;
    while (i < numSigns) {
        let newSignSrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
        if (newSignSrc != notifySrc) {
            imgList.push(newSignSrc);
            i++;
        }
    }
    //add new notify image
    let notifyLoc = getRandomInt(0, numSigns)
    imgList.splice(notifyLoc,0, notifySrc);

    //populate container in random locations for
    for (i = 0; i < imgList.length; i++) {
        const newSign = document.createElement("img");
        newSign.src = imgList[i];
        newSign.style.position = 'absolute';

        const size = await scaleImage(newSign);
        newSign.style.width = `${size.width}px`;
        newSign.style.height = `${size.height}px`;

        const position = getPosition(positions, size, false);
        if (position === null) {
            console.warn(`Couldn't place sign ${i + 1} even with overflow. Stopping placement.`);
            break;
        }

        positions.push({ pos: position, size: size });

        newSign.style.left = `${position.x}px`;
        newSign.style.top = `${position.y}px`;

        if (i === notifyLoc) {
            newSign.addEventListener('click', () => updateUI());
        }
        playContainer.appendChild(newSign);
    }


    numSigns += 3;

    roundNumber++;
    var element = document.getElementById("roundCounter");
    element.textContent = "Round " + roundNumber;

}

//separated into a function so it can also include updates to the scenes as we implement them
function updateUI() {
    nextRound();
}

updateUI();





