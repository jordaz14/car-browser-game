const car = document.querySelector(".car");
let carRect = car.getBoundingClientRect();
const obstacle = document.querySelector(".obstacle");
let obstacleRect = obstacle.getBoundingClientRect();
const road = document.querySelector(".road");
let roadRect = road.getBoundingClientRect();
const highwaySign = document.querySelector(".highway-sign");
let highwaySignRect = highwaySign.getBoundingClientRect();

let gameActive = false;
let animationFrameId;
let trafficCounter = 0;
let topPosition = 0;

const gameStatusSign = document.querySelector(".game-status-sign");
gameStatusSign.addEventListener("keydown", (e) => startGame(e));
gameStatusSign.tabIndex = 0;
gameStatusSign.focus();

function startGame(e) {
  if (e.key == " ") {
    gameActive = true;
    toggleAudio(gameActive);
    document.addEventListener("keydown", handleKeyDown);

    gameStatusSign.style.display = "none";

    randomStartPoint(obstacle, roadRect);
    gameLoop();
  }
}

function gameLoop() {
  if (gameActive == true) {
    if (trafficCounter % 5 == 0 && trafficCounter != 0) {
      obstacle.style.display = "none";
      highwaySign.style.display = "block";
      moveTraffic(highwaySign, highwaySignRect, roadRect);
    } else {
      highwaySign.style.display = "none";
      obstacle.style.display = "block";
      moveTraffic(obstacle, obstacleRect, roadRect);
    }
    if (collisionDetector(car, carRect, obstacle, obstacleRect)) {
      stopGame();
    }
    if (collisionDetector(car, carRect, highwaySign, highwaySignRect)) {
      console.log("SWITCH SCENE");
    }
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  gameActive = false;

  toggleAudio(gameActive);
  document.removeEventListener("keydown", handleKeyDown);
  gameStatusSign.textContent = "GAME OVER";
  gameStatusSign.style.display = "flex";
}

function handleKeyDown(e) {
  if (!gameActive) return;

  carRect = car.getBoundingClientRect();
  obstacleRect = obstacle.getBoundingClientRect();

  car.style.transform = "none";

  moveCar(e, carRect, roadRect);
}

function moveCar(e, movingObjRect, containerRect) {
  const step = 30;

  let newCarLeft = movingObjRect.left - containerRect.left;
  let newCarTop = movingObjRect.top - containerRect.top;

  switch (e.key) {
    case "ArrowLeft":
      newCarLeft -= step;
      break;
    case "ArrowRight":
      newCarLeft += step;
      break;
  }

  newCarLeft = Math.max(
    0,
    Math.min(newCarLeft, containerRect.width - car.offsetWidth)
  );
  newCarTop = Math.max(
    0,
    Math.min(newCarTop, containerRect.height - car.offsetHeight)
  );

  car.style.left = `${newCarLeft}px`;
  car.style.top = `${newCarTop}px`;
}

function moveTraffic(movingObj, movingObjRect, containerRect) {
  topPosition += 30;
  movingObj.style.top = `${topPosition}px`;

  movingObjRect = movingObj.getBoundingClientRect();

  if (movingObjRect.bottom > containerRect.height + 200) {
    trafficCounter++;
    console.log(trafficCounter);
    topPosition = containerRect.top;
    randomStartPoint(movingObj, containerRect);

    // Update the car's position and bounding rectangle
    movingObj.style.top = `${topPosition}px` + 200;
    movingObjRect = movingObj.getBoundingClientRect();
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collisionDetector(movingObj1, rect1, movingObj2, rect2) {
  rect1 = movingObj1.getBoundingClientRect();
  rect2 = movingObj2.getBoundingClientRect();

  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function randomStartPoint(movingObject, objectContainerRect) {
  movingObject.style.left = `${getRandomInt(
    0,
    objectContainerRect.width - movingObject.offsetWidth
  )}px`;
}

function toggleAudio(gameActive) {
  if (gameActive == true) {
    document.getElementById("myAudio").play();
  } else {
    document.getElementById("myAudio").pause();
  }
}
