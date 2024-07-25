const car = document.querySelector(".car");
let carRect = car.getBoundingClientRect();
const otherCar = document.querySelector(".other-car");
let otherCarRect = otherCar.getBoundingClientRect();
const roadContainer = document.querySelector(".road");
const roadRect = roadContainer.getBoundingClientRect();
const notifySign = document.querySelector(".notify-sign");
const highwaySign = document.querySelector(".highway-sign");
let highwaySignRect = highwaySign.getBoundingClientRect();

let gameActive = false;
let animationFrameId;
let trafficCounter = 0;
let topPosition = 0;

notifySign.tabIndex = 0;
notifySign.focus();
notifySign.addEventListener("keydown", (e) => startGame(e));

function startGame(e) {
  if (e.key == " ") {
    notifySign.style.display = "none";
    gameActive = true;
    playAudio();
    document.addEventListener("keydown", handleKeyDown);
    randomStartPoint(otherCar, roadRect);
    gameLoop();
  }
}

function gameLoop() {
  console.log(gameActive);
  if (gameActive == true) {
    if (trafficCounter % 5 == 0 && trafficCounter != 0) {
      moveTraffic(highwaySign, highwaySignRect, roadRect);
    } else {
      moveTraffic(otherCar, otherCarRect, roadRect);
    }
    if (collisionDetector(car, carRect, otherCar, otherCarRect)) {
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
  playAudio();
  document.removeEventListener("keydown", handleKeyDown);
  notifySign.textContent = "GAME OVER";
  notifySign.style.display = "flex";
}

function handleKeyDown(e) {
  if (!gameActive) return;

  carRect = car.getBoundingClientRect();
  otherCarRect = otherCar.getBoundingClientRect();

  car.style.transform = "none";

  moveCar(e, carRect, roadRect);
}

function moveCar(e, movingRect, containerRect) {
  const step = 30;

  let newCarLeft = movingRect.left - containerRect.left;
  let newCarTop = movingRect.top - containerRect.top;

  switch (e.key) {
    /*
    case "ArrowUp":
      newCarTop -= step;
      break;
    case "ArrowDown":
      newCarTop += step;
      break;
*/
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
    movingObj.style.top = `${topPosition}px`;
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

function playAudio() {
  if (gameActive == true) {
    document.getElementById("myAudio").play();
  } else {
    document.getElementById("myAudio").pause();
  }
}
