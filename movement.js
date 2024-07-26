function environmentObject(el, elType) {
  this.el = document.createElement(elType);
  this.el.className = el;
  this.el.src = `./assets/${el}.png`;
  this.rect = this.el.getBoundingClientRect();
}

const car2 = new environmentObject("car", "img");
document.body.appendChild(car2.el);
console.log(car2.el);

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
gameStatusSign.addEventListener("keydown", (event) => startGame(event));
gameStatusSign.tabIndex = 0;
gameStatusSign.focus();

function startGame(event) {
  if (event.key == " ") {
    gameActive = true;
    toggleAudio(gameActive);
    document.addEventListener("keydown", handleArrowKeys);

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
      moveEnvironmentItem(highwaySign, highwaySignRect, roadRect);
    } else {
      highwaySign.style.display = "none";
      obstacle.style.display = "block";
      moveEnvironmentItem(obstacle, obstacleRect, roadRect);
    }
    if (collisionDetector(car, carRect, obstacle, obstacleRect)) {
      stopGame();
    }
    if (collisionDetector(car, carRect, highwaySign, highwaySignRect)) {
      window.location.href = "index.html";
    }
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  gameActive = false;

  toggleAudio(gameActive);
  document.removeEventListener("keydown", handleArrowKeys);
  gameStatusSign.textContent = "GAME OVER";
  gameStatusSign.style.display = "flex";
}

function handleArrowKeys(event) {
  carRect = car.getBoundingClientRect();
  obstacleRect = obstacle.getBoundingClientRect();

  car.style.transform = "none";

  moveUserItem(event, car, carRect, roadRect);
}

function moveUserItem(event, movingItem, movingItemRect, environmentRect) {
  const movement = 30;

  let movingItemLeft = movingItemRect.left - environmentRect.left;
  let movingItemTop = movingItemRect.top - environmentRect.top;

  switch (event.key) {
    case "ArrowLeft":
      movingItemLeft -= movement;
      break;
    case "ArrowRight":
      movingItemLeft += movement;
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

function moveEnvironment() {
  moveObstacle();
  moveScenery();
}

function moveObstacle(movingItem) {
  let obstacle = document.createElement("img");
  obstacle.style.src = "./asset/hole.png";
  obstacle.className = "obstacle";
  randomStartPoint(obstacle, roadRect);
  moveEnvironmentItem();
}

function moveScenery() {}

function moveEnvironmentItem(movingItem, movingItemRect, environmentRect) {
  topPosition += 10;
  movingItem.style.top = `${topPosition}px`;

  movingItemRect = movingItem.getBoundingClientRect();

  if (movingItemRect.bottom > environmentRect.height + 200) {
    trafficCounter++;
    topPosition = environmentRect.top;
    randomStartPoint(movingItem, environmentRect);

    movingItem.style.top = `${topPosition}px` + 200;
    movingItemRect = movingItem.getBoundingClientRect();
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collisionDetector(movingItem1, itemRect1, movingItem2, itemRect2) {
  itemRect1 = movingItem1.getBoundingClientRect();
  itemRect2 = movingItem2.getBoundingClientRect();

  return !(
    itemRect1.right < itemRect2.left ||
    itemRect1.left > itemRect2.right ||
    itemRect1.bottom < itemRect2.top ||
    itemRect1.top > itemRect2.bottom
  );
}

function randomStartPoint(movingItem, itemenvironmentRect) {
  movingItem.style.left = `${getRandomInt(
    0,
    itemenvironmentRect.width - movingItem.offsetWidth
  )}px`;
}

function toggleAudio(gameActive) {
  if (gameActive == true) {
    document.getElementById("myAudio").play();
  } else {
    document.getElementById("myAudio").pause();
  }
}
