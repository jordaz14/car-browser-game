const car = document.querySelector(".car");
let carRect = car.getBoundingClientRect();
const otherCar = document.querySelector(".other-car");
let otherCarRect = otherCar.getBoundingClientRect();
const roadContainer = document.querySelector(".road");
const roadRect = roadContainer.getBoundingClientRect();
const notifySign = document.querySelector(".notify-sign");

let gameActive = false;
let animationFrameId;

let newOtherCarTop = 0;

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
    moveTraffic();
    if (collisionDetector(carRect, otherCarRect)) {
      stopGame();
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

function moveTraffic() {
  newOtherCarTop += 30;
  otherCar.style.top = `${newOtherCarTop}px`;

  if (otherCarRect.bottom > roadRect.height + 200) {
    newOtherCarTop = roadRect.top;
    randomStartPoint(otherCar, roadRect);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collisionDetector(rect1, rect2) {
  carRect = car.getBoundingClientRect();
  otherCarRect = otherCar.getBoundingClientRect();

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
