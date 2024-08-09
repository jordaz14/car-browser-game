import { getRandomInt } from "./helper.js";
import { collisionDetector, randomLeftPos } from "./motion.js";

let gameActive = false;
let gameDifficulty = "normal";
let animationFrameId = 0;
let trafficCounter = 0;
let activeObstacles = [];
let activeScenery = [];
let lastSpawnTime = 0;
let spawnInterval = 4000;
let movement = 2;

const difficulty = {
  easy: {
    el: document.querySelector("#easy-button"),
    handleClick: function () {
      console.log("easy clicked");
      spawnInterval = 5000;
      movement = 1;
      gameDifficulty = "easy";
    },
  },
  normal: {
    el: document.querySelector("#normal-button"),
    handleClick: function () {
      console.log("normal clicked");
      this.el.style.backgroundColor = "red";
      spawnInterval = 4000;
      movement = 2;
      gameDifficulty = "normal";
    },
  },
  hard: {
    el: document.querySelector("#hard-button"),
    handleClick: function () {
      console.log("hard clicked");
      spawnInterval = 3000;
      movement = 3;
      gameDifficulty = "hard";
    },
  },

  setDifficultyLevel() {
    for (const level in difficulty) {
      if (difficulty[level].el) {
        difficulty[level].el.addEventListener(
          "click",
          difficulty[level].handleClick.bind(difficulty[level])
        );
      }
    }
  },
};

difficulty.setDifficultyLevel();

const arrowKeys = {
  ArrowLeft: false,
  ArrowRight: false,
  el: {
    ArrowLeft: document.querySelector("#left-arrow"),
    ArrowRight: document.querySelector("#right-arrow"),
  },
};

let gameStatusSign = document.querySelector(".game-status-sign");
gameStatusSign.addEventListener("click", startGame);

const scores = {
  active: {
    el: document.querySelector("#active-score"),
  },
  high: {
    el: document.querySelector("#high-score"),
    score: sessionStorage.getItem("highScore"),

    setHighScore() {
      this.el.textContent = `HIGH SCORE: ${this.score}`;
    },
  },
};

scores.high.setHighScore();

const road = {
  el: document.querySelector(".road"),
  rect: document.querySelector(".road").getBoundingClientRect(),
};

const dirt = {
  left: {
    el: document.querySelector(".dirt-left"),
    rect: document.querySelector(".dirt-left").getBoundingClientRect(),
  },
  right: {
    el: document.querySelector(".dirt-right"),
    rect: document.querySelector(".dirt-right").getBoundingClientRect(),
  },
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

const cactus = new sceneObj("cactus", "img");
dirt.right.el.append(cactus.el);
activeScenery.push(cactus);

toggleStatusSign();

function startGame() {
  gameActive = true;
  toggleUserInput(gameActive);
  toggleStatusSign(gameActive);
  toggleAudio(gameActive);
  gameLoop(gameActive);
}

function gameLoop(timestamp) {
  if (gameActive == true) {
    moveUser(car, road);

    if (timestamp - lastSpawnTime > spawnInterval) {
      createObstacle();
      lastSpawnTime = timestamp;
    }

    moveSceneObj(activeObstacles, road);
    moveSceneObj(activeScenery, dirt.left);

    if (collisionDetector(car, activeObstacles)) {
      car.el.className = "dead";
      car.el.src = "./assets/skull.png";
      stopGame();
    }

    updateScore(animationFrameId);
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
  const MOVEMENT = movement;

  // Iterate over every object in environment
  for (const activeObj of activeObjsArr) {
    // Move object downwards
    let currentTop = parseInt(activeObj.el.style.top) || 0;
    currentTop += MOVEMENT;
    activeObj.el.style.top = `${currentTop}%`;
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

function toggleUserInput(gameActive) {
  // Add keyboard input if game active
  if (gameActive) {
    document.addEventListener("keydown", (event) => {
      if (arrowKeys.hasOwnProperty(event.key)) {
        arrowKeys[event.key] = true;
        arrowKeys.el[event.key].style.backgroundColor = "black";
        arrowKeys.el[event.key].style.color = "white";
      }
    });
    document.addEventListener("keyup", (event) => {
      if (arrowKeys.hasOwnProperty(event.key)) {
        arrowKeys[event.key] = false;
        arrowKeys.el[event.key].style.backgroundColor = "white";
        arrowKeys.el[event.key].style.color = "black";
      }
    });
  }
  // Remove keyboard input if game over
  else {
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
    gameStatusSign.textContent = `Press to Restart Game`;
    gameStatusSign.removeEventListener("click", startGame);
    gameStatusSign.addEventListener("click", resetGame);
  }
}

function resetGame() {
  window.location.reload();
}

function updateScore(scoreInput) {
  let activeScore = scoreInput;

  switch (gameDifficulty) {
    case "easy":
      activeScore *= 1 / 2;
      break;
    case "normal":
      activeScore;
      break;
    case "hard":
      activeScore *= 2;
      break;
  }

  activeScore = Math.round(activeScore);

  scores.active.el.textContent = `SCORE: ${activeScore}`;

  if (activeScore > scores.high.score) {
    sessionStorage.setItem("highScore", activeScore);
    scores.high.el.textContent = `High Score: ${activeScore}`;
  }
}
