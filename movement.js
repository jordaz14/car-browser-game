const car = document.querySelector(".car");
const otherCar = document.querySelector(".other-car");
const roadContainer = document.querySelector(".road");
const roadRect = roadContainer.getBoundingClientRect();
const notifySign = document.querySelector(".notify-sign");
let carRect = car.getBoundingClientRect();
let otherCarRect = otherCar.getBoundingClientRect();
let gameActive = false;
let animationFrameId;

let newOtherCarTop = 0;

startGame();

function startGame() {
  gameActive = true;
  document.addEventListener("keydown", handleKeyDown);
  otherCar.style.left = `${getRandomInt(
    0,
    roadRect.width - otherCar.offsetWidth
  )}px`;
  gameLoop();
}

function stopGame() {
  gameActive = false;
  document.removeEventListener("keydown", handleKeyDown);
  notifySign.style.display = "flex";
}

function gameLoop() {
  moveTraffic();
  if (collisionDetector(carRect, otherCarRect)) {
    stopGame();
  }
  animationFrameId = requestAnimationFrame(gameLoop);
}

function handleKeyDown(e) {
  if (!gameActive) return;

  carRect = car.getBoundingClientRect();
  otherCarRect = otherCar.getBoundingClientRect();

  moveCar(e, carRect, roadRect);

  if (checkIfTouching(carRect, otherCarRect)) {
    stopGame();
  }
}

function moveCar(e, movingRect, containerRect) {
  const step = 20;

  let newCarLeft = movingRect.left - containerRect.left;
  let newCarTop = movingRect.top - containerRect.top;

  switch (e.key) {
    case "ArrowUp":
      newCarTop -= step;
      break;
    case "ArrowDown":
      newCarTop += step;
      break;
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

function checkIfTouching(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function moveTraffic() {
  newOtherCarTop += 2;
  otherCar.style.top = `${newOtherCarTop}px`;
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
