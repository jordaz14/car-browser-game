const otherGameStatus = sessionStorage.getItem("gameStatus");

const arrowKeys = {
  ArrowLeft: false,
  ArrowRight: false,
};

let gameActive = false;
let animationFrameId;
let trafficCounter = 0;

const gameStatusSign = document.createElement("button");
gameStatusSign.className = "game-status-sign";
gameStatusSign.addEventListener("keydown", (event) => handleSpacebar(event));

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

toggleStatusSign();

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
  gameLoop(gameActive);
}

function gameLoop() {
  if (gameActive == true) {
    moveUser(car, road);

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

function moveUser(movingObj, scene) {
  const MOVEMENT = 10;

  // Get the current position from the object's rect
  movingObj.updateRect();

  // Calculate object width
  const objWidth = movingObj.rect.width;

  if (arrowKeys.ArrowLeft) {
    // Move left
    if (movingObj.rect.left - MOVEMENT >= scene.rect.left) {
      movingObj.el.style.left = `${
        movingObj.rect.left - scene.rect.left - MOVEMENT
      }px`;
    } else {
      movingObj.el.style.left = `${0}px`;
    }
  }
  if (arrowKeys.ArrowRight) {
    // Move right
    if (movingObj.rect.right + MOVEMENT <= scene.rect.right) {
      movingObj.el.style.left = `${
        movingObj.rect.left - scene.rect.left + MOVEMENT
      }px`;
    } else {
      movingObj.el.style.left = `${
        scene.rect.right - objWidth - scene.rect.left
      }px`;
    }
  }
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

    // Update position of object
    currentTop = scene.rect.top;
    randomLeftPos(movingObj, scene);
    movingObj.el.style.top = `${currentTop - OFFSET}px`;
    movingObj.updateRect();
  }
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toggleUserInput(gameActive) {
  if (gameActive) {
    document.addEventListener("keydown", (event) => {
      if (arrowKeys.hasOwnProperty(event.key)) {
        arrowKeys[event.key] = true;
      }
    });
    document.addEventListener("keyup", (event) => {
      if (arrowKeys.hasOwnProperty(event.key)) {
        arrowKeys[event.key] = false;
      }
    });
  } else {
    document.removeEventListener("keydown", (event) => {
      if (arrowKeys.hasOwnPropert(event.key)) {
        arrowKeys[event.key] = true;
      }
    });
    document.removeEventListener("keyup", (event) => {
      if (arrowKeys.hasOwnProperty(event.key)) {
        arrowKeys[event.key] = false;
      }
    });
  }
}

function toggleAudio(gameActive) {
  gameActive == true
    ? document.querySelector("#audio-player").play()
    : document.querySelector("#audio-player").pause();
}

function toggleStatusSign(gameActive) {
  if (gameActive) {
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
