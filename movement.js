const otherGameStatus = sessionStorage.getItem("gameStatus");

let gameActive = false;
let animationFrameId;
let trafficCounter = 0;

const gameStatusSign = document.createElement("button");
gameStatusSign.className = "game-status-sign";
gameStatusSign.addEventListener("keydown", (event) => handleSpacebar(event));
toggleStatusSign();

const road = {
  el: document.querySelector(".road"),
  rect: document.querySelector(".road").getBoundingClientRect(),
};

function sceneObj(el, elType) {
  this.el = document.createElement(elType);
  this.el.className = el;
  elType == "img" ? (this.el.src = `./assets/${el}.png`) : (this.el.src = null);
  this.rect = this.el.getBoundingClientRect();

  this.updateRect = function () {
    this.rect = this.el.getBoundingClientRect();
  };
}

const car = new sceneObj("car", "img");
road.el.appendChild(car.el);

const hole = new sceneObj("hole", "img");
road.el.appendChild(hole.el);

const highwaySign = new sceneObj("hw-sign", "img");
road.el.appendChild(highwaySign.el);

if (otherGameStatus === "true") {
  startGame();
} else {
}

function startGame() {
  gameActive = true;
  toggleUserInput(gameActive);
  toggleStatusSign(gameActive);
  toggleAudio(gameActive);
  randomLeftPos(hole, road);
  gameLoop();
}

function gameLoop() {
  if (gameActive == true) {
    animationFrameId == 1 ? console.log("START") : null;

    if (trafficCounter % 5 == 0 && trafficCounter != 0) {
      console.log(highwaySign.el.style.display);
      highwaySign.el.style.display = "block";
      console.log(highwaySign.el.style.display);
      moveSceneObj(highwaySign, road);
    } else {
      moveSceneObj(hole, road);
    }
    if (collisionDetector(car, hole)) {
      stopGame();
    }
    if (collisionDetector(car, highwaySign)) {
      //window.location.href = "index.html";
    }
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  gameActive = false;
  sessionStorage.setItem("gameStatus", "false");
  toggleUserInput(gameActive);
  toggleStatusSign(gameActive);
  toggleAudio(gameActive);
}

function moveUserItem(event, movingItem, movingItemRect, environmentRect) {
  const MOVEMENT = 30;

  let movingItemLeft = movingItemRect.left - environmentRect.left;
  let movingItemTop = movingItemRect.top - environmentRect.top;

  switch (event.key) {
    case "ArrowLeft":
      movingItemLeft -= MOVEMENT;
      break;
    case "ArrowRight":
      movingItemLeft += MOVEMENT;
      break;
  }

  movingItemLeft = Math.max(
    0,
    Math.min(movingItemLeft, environmentRect.width - movingItem.offsetWidth)
  );
  movingItemTop = Math.max(
    0,
    Math.min(movingItemTop, environmentRect.height - movingItem.offsetHeight)
  );

  movingItem.style.left = `${movingItemLeft}px`;
  movingItem.style.top = `${movingItemTop}px`;
}

function moveSceneObj(movingObj, scene) {
  const OFFSET = 200;
  const MOVEMENT = 10;

  // Move object downwards
  let currentTop = parseInt(movingObj.el.style.top) || 0;
  currentTop += MOVEMENT;
  movingObj.el.style.top = `${currentTop}px`;
  movingObj.updateRect();

  // Check if object is out of scene bounds
  if (movingObj.rect.bottom > scene.rect.height + OFFSET) {
    trafficCounter++;
    currentTop = scene.rect.top;

    // Update position of object
    randomLeftPos(movingObj, scene);
    movingObj.el.style.top = `${currentTop - OFFSET}px`;
    movingObj.updateRect();
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collisionDetector(movingObj1, movingObj2) {
  movingObj1.updateRect();
  movingObj2.updateRect();

  return !(
    movingObj1.rect.right < movingObj2.rect.left ||
    movingObj1.rect.left > movingObj2.rect.right ||
    movingObj1.rect.bottom < movingObj2.rect.top ||
    movingObj1.rect.top > movingObj2.rect.bottom
  );
}

function randomLeftPos(movingObj, scene) {
  movingObj.el.style.left = `${getRandomInt(
    0,
    scene.rect.width - movingObj.el.offsetWidth
  )}px`;
}

function toggleUserInput(gameActive) {
  gameActive == true
    ? document.addEventListener("keydown", handleArrowKeys)
    : document.removeEventListener("keydown", handleArrowKeys);
}

function handleArrowKeys(event) {
  car.updateRect();

  car.el.style.transform = "none";

  moveUserItem(event, car.el, car.rect, road.rect);
}

function toggleAudio(gameActive) {
  gameActive == true
    ? document.querySelector("#audio-player").play()
    : document.querySelector("#audio-player").pause();
}

function toggleStatusSign(gameActive) {
  if (gameActive == true) {
    document.body.removeChild(gameStatusSign);
  } else if (gameActive == false) {
    gameStatusSign.textContent = `Press Space to Restart`;
    document.body.appendChild(gameStatusSign);
    gameStatusSign.focus();
  } else {
    gameStatusSign.textContent = `Press Space to Start`;
    document.body.appendChild(gameStatusSign);
    gameStatusSign.focus();
  }
}

function handleSpacebar(event) {
  if (event.key == " ") {
    startGame();
  }
}
