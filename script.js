const arrowKeys = {
  ArrowLeft: false,
  ArrowRight: false,
};

let gameActive = false;
let animationFrameId;
let trafficCounter = 0;
let activeObstacles = [];

const gameStatusSign = document.createElement("button");
gameStatusSign.className = "game-status-sign";
gameStatusSign.addEventListener("keydown", (event) => handleSpacebar(event));

const road = {
  el: document.querySelector(".road"),
  rect: document.querySelector(".road").getBoundingClientRect(),
};

const dirt = {
  elLeft: document.querySelector(".dirt-left"),
  elLeftRect: document.querySelector(".dirt-left").getBoundingClientRect(),
  elRight: document.querySelector(".dirt-right"),
  elRightRect: document.querySelector(".dirt-right").getBoundingClientRect(),
};

class sceneObj {
  constructor(el, elType) {
    this.el = document.createElement(elType);
    this.el.className = el;
    elType == "img"
      ? (this.el.src = `./assets/${el}.png`)
      : (this.el.src = null);
    this.rect = this.el.getBoundingClientRect();
  }

  updateRect() {
    this.rect = this.el.getBoundingClientRect();
  }
}

const car = new sceneObj("car", "img");
road.el.appendChild(car.el);

toggleStatusSign();

function startGame() {
  gameActive = true;
  toggleUserInput(gameActive);
  toggleStatusSign(gameActive);
  toggleAudio(gameActive);
  gameLoop(gameActive);
}

let lastSpawnTime = 0;
const spawnInterval = 1000;

let obstacleList = [];

function gameLoop(timestamp) {
  if (gameActive == true) {
    moveUser(car, road);

    if (timestamp - lastSpawnTime > spawnInterval) {
      createObstacle();
      lastSpawnTime = timestamp;
    }

    moveSceneObj(activeObstacles, road);

    collisionDetector(car, activeObstacles) ? stopGame() : null;

    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  gameActive = false;
  toggleUserInput(gameActive);
  toggleStatusSign(gameActive);
  toggleAudio(gameActive);
}

function createObstacle() {
  const newObstacle = new sceneObj("hole", "img");
  randomLeftPos(newObstacle, road);
  road.el.appendChild(newObstacle.el);
  activeObstacles.push(newObstacle);
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

function moveSceneObj(activeObjsArr, scene) {
  const OFFSET = 200;
  const MOVEMENT = 10;

  // Iterate over every object in environment
  for (const activeObj of activeObjsArr) {
    // Move object downwards
    let currentTop = parseInt(activeObj.el.style.top) || 0;
    currentTop += MOVEMENT;
    activeObj.el.style.top = `${currentTop}px`;
    activeObj.updateRect();

    // Check if object is out of scene bounds
    if (activeObj.rect.bottom > scene.rect.height + OFFSET) {
      trafficCounter++;

      // Update position of object
      currentTop = scene.rect.top;
      randomLeftPos(activeObj, scene);
      activeObj.el.style.top = `${currentTop - OFFSET}px`;
      activeObj.updateRect();
    }
  }
}

function collisionDetector(movingObj, activeObjsArr) {
  movingObj.updateRect();

  for (const activeObj of activeObjsArr) {
    activeObj.updateRect();

    const isColliding = !(
      movingObj.rect.right < activeObj.rect.left ||
      movingObj.rect.left > activeObj.rect.right ||
      movingObj.rect.bottom < activeObj.rect.top ||
      movingObj.rect.top > activeObj.rect.bottom
    );

    if (isColliding) {
      return true;
    }
  }

  return false;
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
