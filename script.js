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


//making sure image doesnt exceed max w or h 
async function createScaledSignElement(src) {
    const img = new Image();
    img.src = src;
    await new Promise(resolve => img.onload = resolve);
    
    let width = img.naturalWidth;
    let height = img.naturalHeight;
    const scaleFactor = Math.min(maxSignSize / width, maxSignSize / height, 1);
    
    width *= scaleFactor;
    height *= scaleFactor;
    
    img.width = width;
    img.height = height;
    return img;
}


function packSigns(signs, containerWidth, containerHeight) {
    const positions = [];
    const spaces = [{x: 0, y: 0, w: containerWidth, h: containerHeight}];
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
  
    // Sort signs by area in descending order
    signs.sort((a, b) => (b.width * b.height) - (a.width * a.height));
  
    for (const sign of signs) {
      let bestSpace = null;
      let bestScore = Infinity;
  
      for (let i = spaces.length - 1; i >= 0; i--) {
        const space = spaces[i];
        if (space.w >= sign.width && space.h >= sign.height) {
          // Calculate distance from center of the space to the center of the container
          const spaceCenterX = space.x + space.w / 2;
          const spaceCenterY = space.y + space.h / 2;
          const distanceToCenter = Math.sqrt(
            Math.pow(spaceCenterX - centerX, 2) + 
            Math.pow(spaceCenterY - centerY, 2)
          );
          
          // Combine fit score and centrality score
          const fitScore = Math.max(space.w - sign.width, space.h - sign.height);
          const centralityScore = distanceToCenter / Math.sqrt(containerWidth * containerWidth + containerHeight * containerHeight);
          const score = fitScore + centralityScore * 100; // Adjust weight as needed
  
          if (score < bestScore) {
            bestSpace = space;
            bestScore = score;
          }
        }
      }
  
      if (bestSpace) {
        positions.push({x: bestSpace.x, y: bestSpace.y});
        
        // Split the space
        if (bestSpace.w - sign.width > 0) {
          spaces.push({
            x: bestSpace.x + sign.width,
            y: bestSpace.y,
            w: bestSpace.w - sign.width,
            h: sign.height
          });
        }
        if (bestSpace.h - sign.height > 0) {
          spaces.push({
            x: bestSpace.x,
            y: bestSpace.y + sign.height,
            w: bestSpace.w,
            h: bestSpace.h - sign.height
          });
        }
        
        // Remove the used space
        const index = spaces.indexOf(bestSpace);
        spaces.splice(index, 1);
      } else {
        // If we can't fit the sign, place it near the center with some randomness
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * Math.min(containerWidth, containerHeight) / 4;
        positions.push({
          x: Math.max(0, Math.min(containerWidth - sign.width, centerX + Math.cos(angle) * distance - sign.width / 2)),
          y: Math.max(0, Math.min(containerHeight - sign.height, centerY + Math.sin(angle) * distance - sign.height / 2))
        });
      }
    }
  
    // Calculate the centroid of all placed signs
    const centroid = calculateCentroid(positions, signs);
  
    // Adjust positions to center the group
    const xOffset = centerX - centroid.x;
    const yOffset = centerY - centroid.y;
    
    positions.forEach(pos => {
      pos.x += xOffset;
      pos.y += yOffset;
      // Ensure signs stay within the container
      pos.x = Math.max(0, Math.min(containerWidth - signs[positions.indexOf(pos)].width, pos.x));
      pos.y = Math.max(0, Math.min(containerHeight - signs[positions.indexOf(pos)].height, pos.y));
    });
  
    return positions;
  }

async function populateGame() {
    playContainer.innerHTML = '';
    const containerRect = playContainer.getBoundingClientRect();
    
    //generate src for imgs
    let imgList = [];
    for (let i = 0; i < numSigns; i++) {
        let newSignSrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
        if (newSignSrc !== notifySrc) {
            imgList.push(newSignSrc);
        }
    }
    
    //insert notify to list
    let notifyLoc = getRandomInt(0, imgList.length);
    imgList.splice(notifyLoc, 0, notifySrc);

    //scale if needed and get all img elements into signElements
    const signElements = await Promise.all(imgList.map(createScaledSignElement));
    
    // Use a smaller width and height for packing to ensure signs fit within the container
    const packedPositions = packSigns(signElements, containerRect.width, containerRect.height);

    packedPositions.forEach((position, index) => {
        const sign = signElements[index];
        sign.style.position = 'absolute';
        sign.style.left = `${position.x}px`;
        sign.style.top = `${position.y}px`;
        
        if (imgList[index] === notifySrc) {
            sign.addEventListener('click', updateUI);
        }
        
        playContainer.appendChild(sign);
    });

    numSigns += 2;
    roundNumber++;
    document.getElementById("roundCounter").textContent = "Round " + roundNumber;
}

function calculateCentroid(positions, elements) {
    let totalX = 0, totalY = 0, totalArea = 0;
    positions.forEach((pos, index) => {
      const element = elements[index];
      const area = element.width * element.height;
      totalX += (pos.x + element.width / 2) * area;
      totalY += (pos.y + element.height / 2) * area;
      totalArea += area;
    });
    return { x: totalX / totalArea, y: totalY / totalArea };
}


function calculateBoundingBox(positions, elements) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    positions.forEach((pos, index) => {
        const element = elements[index];
        minX = Math.min(minX, pos.x);
        minY = Math.min(minY, pos.y);
        maxX = Math.max(maxX, pos.x + element.width);
        maxY = Math.max(maxY, pos.y + element.height);
    });

    return {
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}
//separated into a function so it can also include updates to the scenes as we implement them
function updateUI() {
    nextRound();
}

updateUI();





