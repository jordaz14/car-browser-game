console.log("Welcome to Traffic Game.");

//checks that there is a playcontainer in dom
const playContainer = document.querySelector(".play-container");
console.log(playContainer);

//check for notify sign div in HTML
const notifySign = document.querySelector(".notify-sign");
//created an image element
const signImageNotify = document.createElement("img");
//appends it to the notify-sign div 
notifySign.appendChild(signImageNotify);


let notifySrc = ""; //makes string for notify src 
let numSigns = 10; //starting num of signs displayed
var roundNumber = 0; //round variable
const maxSignSize = 180; //limits the sign size (in pixels)

//random int function
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//called when next round is started
function nextRound() {
  //update round number UI
  roundNumber++;
  document.getElementById("roundCounter").textContent = "Round " + roundNumber;
  //get new notify sign
  newNotify();
  //fill up play container div with new random signs 
  populateGame();
}

//get a new sign image 
function newNotify() {
  //get a random image src to be the notify sign
  notifySrc = `./assets/signs/image_${getRandomInt(1, 515)}.png`;
  //set the notify-sign in the header to have that source
  signImageNotify.src = notifySrc;
  signImageNotify.alt = "Traffic sign";
}


//beta distribution function for placing signs
function betaDistribution(alpha, beta) {
  let u = Math.random();
  let v = Math.random();
  let x = Math.pow(u, 1 / alpha);
  let y = Math.pow(v, 1 / beta);
  return x / (x + y);
}

//function checking overlapping
function isOverlapping(newPos, newSize, existingPositions) {
  //iterate through existing positions list
  for (let item of existingPositions) {
    if (
      newPos.x < item.pos.x + item.size.width &&
      newPos.x + newSize.width > item.pos.x &&
      newPos.y < item.pos.y + item.size.height &&
      newPos.y + newSize.height > item.pos.y
    ) {
      return true;
    }
  }
  return false;
}

//making sure image doesnt exceed max w or h
async function createScaledSignElement(src) {
  //make a new Image element
  const img = new Image();
  //assign it a source
  img.src = src;
  //waits for image to fully load
  await new Promise((resolve) => (img.onload = resolve));

  //gets its height and width
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  //creates a scale factor by dividing existing dimentions
  const scaleFactor = Math.min(maxSignSize / width, maxSignSize / height, 1);

  //multiplies each by scale factor 
  width *= scaleFactor;
  height *= scaleFactor;

  //sets new image height and width
  img.width = width;
  img.height = height;
  //returns image element
  return img;
}


//2D packing greedy algorithm 
function packSigns(signs, containerWidth, containerHeight, allowOverflow = false) {
  //list of positons
  const positions = [];
  //makes an array where each item has object literals 
  const spaces = [{x: 0, y: 0, w: containerWidth, h: containerHeight}];
  //defines the center of play container as an x value
  const centerX = containerWidth / 2;
  //defines the center of play container as a y value
  const centerY = containerHeight / 2;

  // Sort signs by area in descending order
  //signs.sort((a, b) => (b.width * b.height) - (a.width * a.height));

  //for loop goes through each image element in signs
  for (const sign of signs) {
      let bestSpace = null;//no existing best space yet
      let bestScore = Infinity; //infinite best score

      //runs through number of spaces, which will initially not run
      for (let i = spaces.length - 1; i >= 0; i--) {
          //defines space as what is empty of the container
          const space = spaces[i];
          //sees if the sign is less wide than the space and less tall than the space
          if (space.w >= sign.width && space.h >= sign.height) {
              //assigns a fitscore dependding on difference between space w and sign w, and diff between spcace h and sign h
              const fitScore = Math.max(space.w - sign.width, space.h - sign.height);
              //assigns a centrality score 
              const centralityScore = calculateDistance(space, sign, centerX, centerY, containerWidth, containerHeight);
              const score = fitScore + centralityScore * 50;

              //updates best spaces and scores
              if (score < bestScore) {
                  bestSpace = space;
                  bestScore = score;
              }
          }
      }

      //if there is a best space, push x positions there
      if (bestSpace) {
          positions.push({x: bestSpace.x, y: bestSpace.y, width: sign.width, height: sign.height});
          updateSpaces(bestSpace, sign, spaces);
      } else {
          const position = randomPosition(sign, centerX, centerY, containerWidth, containerHeight);
          positions.push(position);
      }
  }

  return positions;
}

function updateSpaces(bestSpace, sign, spaces) {
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
  spaces.splice(spaces.indexOf(bestSpace), 1);
}


function calculateDistance(space, sign, centerX, centerY, containerWidth, containerHeight) {
  const spaceCenterX = space.x + space.w / 2;
  const spaceCenterY = space.y + space.h / 2;
  return Math.sqrt(Math.pow(spaceCenterX - centerX, 2) + Math.pow(spaceCenterY - centerY, 2)) /
         Math.sqrt(containerWidth * containerWidth + containerHeight * containerHeight);
}

function randomPosition(sign, centerX, centerY, containerWidth, containerHeight) {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * Math.min(containerWidth, containerHeight) / 1.5 ; 

  // Calculate x and y with bias adjustments
  let x = centerX + Math.cos(angle) * distance - sign.width / 2 + getRandomInt(10,100); // Add bias towards the bottom-left
  let y = centerY + Math.sin(angle) * distance - sign.height / 2 + getRandomInt(10,100); // Add bias towards the bottom-left

  // Ensure the sign stays within the boundaries of the container
  x = Math.max(0, Math.min(containerWidth - sign.width, x));
  y = Math.max(0, Math.min(containerHeight - sign.height, y));

  return {
      x: x,
      y: y,
      width: sign.width,
      height: sign.height
  };
}

/*
function packSigns(signs, containerWidth, containerHeight) {
  const positions = [];
  const spaces = [{ x: 0, y: 0, w: containerWidth, h: containerHeight }];
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Sort signs by area in descending order
  signs.sort((a, b) => b.width * b.height - a.width * a.height);

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
        const centralityScore =
          distanceToCenter /
          Math.sqrt(
            containerWidth * containerWidth + containerHeight * containerHeight
          );
        const score = fitScore + centralityScore * 75; // Adjust weight as needed

        if (score < bestScore) {
          bestSpace = space;
          bestScore = score;
        }
      }
    }

    if (bestSpace) {
      positions.push({ x: bestSpace.x, y: bestSpace.y });

      // Split the space
      if (bestSpace.w - sign.width > 0) {
        spaces.push({
          x: bestSpace.x + sign.width,
          y: bestSpace.y,
          w: bestSpace.w - sign.width,
          h: sign.height,
        });
      }
      if (bestSpace.h - sign.height > 0) {
        spaces.push({
          x: bestSpace.x,
          y: bestSpace.y + sign.height,
          w: bestSpace.w,
          h: bestSpace.h - sign.height,
        });
      }

      // Remove the used space
      const index = spaces.indexOf(bestSpace);
      spaces.splice(index, 1);
    } else {
      // If we can't fit the sign, place it near the center with some randomness
      const angle = Math.random() * 2 * Math.PI;
      const distance =
        (Math.random() * Math.min(containerWidth, containerHeight)) / 4;
      positions.push({
        x: Math.max(
          0,
          Math.min(
            containerWidth - sign.width,
            centerX + Math.cos(angle) * distance - sign.width / 2
          )
        ),
        y: Math.max(
          0,
          Math.min(
            containerHeight - sign.height,
            centerY + Math.sin(angle) * distance - sign.height / 2
          )
        ),
      });
    }
  }

  // Calculate the centroid of all placed signs
  const centroid = calculateCentroid(positions, signs);

  // Adjust positions to center the group
  const xOffset = centerX - centroid.x;
  const yOffset = centerY - centroid.y;

  positions.forEach((pos) => {
    pos.x += xOffset;
    pos.y += yOffset;
    // Ensure signs stay within the container
    pos.x = Math.max(
      0,
      Math.min(containerWidth - signs[positions.indexOf(pos)].width, pos.x)
    );
    pos.y = Math.max(
      0,
      Math.min(containerHeight - signs[positions.indexOf(pos)].height, pos.y)
    );
  });

  return positions;
}
*/
baseURL = window.location.origin;

async function populateGame() {
  playContainer.innerHTML = "";
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
  const packedPositions = packSigns(
    signElements,
    containerRect.width,
    containerRect.height
  );

  console.log("start here");

  packedPositions.forEach((position, index) => {
    const sign = signElements[index];
    sign.style.position = "absolute";
    sign.style.left = `${position.x}px`;
    sign.style.top = `${position.y}px`;

    fixedSign = sign.src.replace(baseURL, "");
    fixedSign = `.${fixedSign}`;

    if (fixedSign === notifySrc) {
      console.log("MATCH FOUND");
      sign.style.zIndex = "100";
      sign.setAttribute('id', "WHERE")
      sign.addEventListener("click", () => updateUI());
    }

    playContainer.appendChild(sign);
  });

  numSigns += 3;
}

function calculateCentroid(positions, elements) {
  let totalX = 0,
    totalY = 0,
    totalArea = 0;
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
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

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
    height: maxY - minY,
  };
}
//separated into a function so it can also include updates to the scenes as we implement them
function updateUI() {
  nextRound();
}

updateUI();
