const otherGameStatus = sessionStorage.getItem("gameStatus");
console.log(otherGameStatus);

function environmentObject(el, elType) {
  this.el = document.createElement(elType);
  this.el.className = el;
  elType == "img" ? (this.el.src = `./assets/${el}.png`) : (this.el.src = null);
  this.rect = this.el.getBoundingClientRect();

  this.updateRect = function () {
    this.rect = this.el.getBoundingClientRect();
  };
}

const road = {
  el: document.querySelector(".road"),
  rect: document.querySelector(".road").getBoundingClientRect(),
};

const car = new environmentObject("car", "img");
road.el.appendChild(car.el);

const hole = new environmentObject("hole", "img");
road.el.appendChild(hole.el);

const highwaySign = new environmentObject("hw-sign", "img");
road.el.appendChild(highwaySign.el);

let gameActive = false;
let animationFrameId;
let trafficCounter = 0;
let topPosition = 0;

const gameStatusSign = document.querySelector(".game-status-sign");
if (otherGameStatus === "true") {
  console.log("true path");
  startGame();
} else {
  console.log("false path");
  gameStatusSign.addEventListener("keydown", (event) => startGame(event));
  gameStatusSign.tabIndex = 0;
  gameStatusSign.focus();
}

function handleSpacebar(event) {
  if (event.key == " ") {
    startGame();
  }
}

function startGame() {
  gameStatusSign.style.display = "none";
  gameActive = true;
  toggleAudio(gameActive);
  document.addEventListener("keydown", handleArrowKeys);

  randomStartPoint(hole.el, road.rect);
  gameLoop();
}

function gameLoop() {
  if (gameActive == true) {
    animationFrameId == 1 ? console.log("START") : null;

    if (trafficCounter % 5 == 0 && trafficCounter != 0) {
      console.log(highwaySign.el.style.display);
      highwaySign.el.style.display = "block";
      console.log(highwaySign.el.style.display);
      moveEnvironmentItem(highwaySign.el, highwaySign.rect, road.rect);
    } else {
      moveEnvironmentItem(hole.el, hole.rect, road.rect);
    }
    if (collisionDetector(car.el, car.rect, hole.el, hole.rect)) {
      stopGame();
    }
    if (collisionDetector(car.el, car.rect, highwaySign.el, highwaySign.rect)) {
      window.location.href = "index.html";
    }
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  gameActive = false;
  sessionStorage.setItem("gameStatus", "false");
  toggleAudio(gameActive);
  document.removeEventListener("keydown", handleArrowKeys);
  gameStatusSign.textContent = "GAME OVER";
  gameStatusSign.style.display = "flex";
}

function handleArrowKeys(event) {
  car.updateRect();

  car.el.style.transform = "none";

  moveUserItem(event, car.el, car.rect, road.rect);
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
    console.log(trafficCounter);
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

function collisionDetector(
  movingItem1,
  movingItemRect1,
  movingItem2,
  movingItemRect2
) {
  movingItemRect1 = movingItem1.getBoundingClientRect();
  movingItemRect2 = movingItem2.getBoundingClientRect();

  return !(
    movingItemRect1.right < movingItemRect2.left ||
    movingItemRect1.left > movingItemRect2.right ||
    movingItemRect1.bottom < movingItemRect2.top ||
    movingItemRect1.top > movingItemRect2.bottom
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
