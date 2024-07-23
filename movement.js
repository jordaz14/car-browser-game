const movableCar = document.querySelector(".car");
const roadContainer = movableCar.parentElement;

document.addEventListener("keydown", (e) => {
  const step = 10;
  const roadRect = roadContainer.getBoundingClientRect();
  const carRect = movableCar.getBoundingClientRect();

  let newLeft = carRect.left - roadRect.left;
  let newTop = carRect.top - roadRect.top;

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
      return;
  }

  newLeft = Math.max(
    0,
    Math.min(newLeft, roadRect.width - movableCar.offsetWidth)
  );
  newTop = Math.max(
    0,
    Math.min(newTop, roadRect.height - movableCar.offsetHeight)
  );

  movableCar.style.left = `${newLeft}px`;
  movableCar.style.top = `${newTop}px`;
});
