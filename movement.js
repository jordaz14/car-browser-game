const movableCar = document.querySelector(".car");
const otherCar = document.querySelector(".other-car");
const roadContainer = document.querySelector(".road");

document.addEventListener("keydown", (e) => {
  const roadRect = roadContainer.getBoundingClientRect();
  const carRect = movableCar.getBoundingClientRect();
  const otherCarRect = otherCar.getBoundingClientRect();

  moveUserCar(e, carRect, roadRect);

  if (checkIfTouching(carRect, otherCarRect)) {
    alert("CRASH!");
  }
});

function moveUserCar(e, movingRect, containerRect) {
  const step = 20;

  let newLeft = movingRect.left - containerRect.left;
  let newTop = movingRect.top - containerRect.top;

  switch (e.key) {
    case "ArrowUp":
      newTop -= step;
      break;
    case "ArrowDown":
      newTop += step;
      break;
    case "ArrowLeft":
      newLeft -= step;
      break;
    case "ArrowRight":
      newLeft += step;
      break;
  }

  newLeft = Math.max(
    0,
    Math.min(newLeft, containerRect.width - movableCar.offsetWidth)
  );
  newTop = Math.max(
    0,
    Math.min(newTop, containerRect.height - movableCar.offsetHeight)
  );

  movableCar.style.left = `${newLeft}px`;
  movableCar.style.top = `${newTop}px`;
}

function checkIfTouching(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}
