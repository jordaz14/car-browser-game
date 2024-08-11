import { helper } from "./modules/helper.js";
import { motion } from "./modules/motion.js";
import { audio } from "./modules/audio.js";

export const gameState = {
  active: false,
  muted: helper.toBoolean(sessionStorage.getItem("muted")),
  difficultyLevel: undefined,
  movement: undefined,
  lastSpawnTime: 0,
  spawnInterval: undefined,
};

let animationFrameId = 0;
let activeObstacles = [];
let activeScenery = [];

const difficulty = {
  easy: {
    el: document.querySelector("#easy-button"),
    status: false,
    handleClick: function () {
      difficulty.toggleDifficultyStatus(this);
      difficulty.toggleDifficultyUI();
      difficulty.setDifficultyGameState("easy", 1, 5000);
      audio.playSoundEffect("select");
      audio.setAudioSpeed();
    },
  },
  normal: {
    el: document.querySelector("#normal-button"),
    status: true,
    handleClick: function () {
      difficulty.toggleDifficultyStatus(this);
      difficulty.toggleDifficultyUI();
      difficulty.setDifficultyGameState("normal", 2, 4000);
      audio.playSoundEffect("select");
      audio.setAudioSpeed();
    },
  },
  hard: {
    el: document.querySelector("#hard-button"),
    status: false,
    handleClick: function () {
      difficulty.toggleDifficultyStatus(this);
      difficulty.toggleDifficultyUI();
      difficulty.setDifficultyGameState("hard", 3, 3000);
      audio.playSoundEffect("select");
      audio.setAudioSpeed();
    },
  },

  addDifficultyEventHandler() {
    for (const level in difficulty) {
      if (difficulty[level].el) {
        difficulty[level].boundHandleClick = difficulty[level].handleClick.bind(
          difficulty[level]
        );
        difficulty[level].el.addEventListener(
          "click",
          difficulty[level].boundHandleClick
        );
      }
    }
  },

  removeDifficultyEventHandler() {
    for (const level in difficulty) {
      if (difficulty[level].el) {
        difficulty[level].el.removeEventListener(
          "click",
          difficulty[level].boundHandleClick
        );
      }
    }
  },

  checkCachedDifficulty() {
    const cachedDifficulty = sessionStorage.getItem("difficulty");
    if (cachedDifficulty) {
      for (const level in difficulty) {
        if (difficulty[level].el) {
          if (
            difficulty[level].el.textContent.toLowerCase() == cachedDifficulty
          ) {
            difficulty[level].status = true;
          } else {
            difficulty[level].status = false;
          }
        }
      }
    }
  },

  toggleDifficultyStatus(difficultyLevel) {
    for (const level in difficulty) {
      if (difficulty[level] == difficultyLevel) {
        difficulty[level].status = true;
        sessionStorage.setItem(
          "difficulty",
          difficulty[level].el.textContent.toLowerCase()
        );
      } else if (difficulty[level].el) {
        difficulty[level].status = false;
      }
    }
  },

  toggleDifficultyUI() {
    for (const level in difficulty) {
      if (difficulty[level].status) {
        difficulty[level].el.style.backgroundColor = "white";
        difficulty[level].el.style.color = "black";
      } else if (difficulty[level].el) {
        difficulty[level].el.style.backgroundColor = "black";
        difficulty[level].el.style.color = "white";
      }
    }
  },

  setDifficultyGameState(difficultyLevel, movement, spawnInterval) {
    const cachedDifficulty = sessionStorage.getItem("difficulty");
    if (cachedDifficulty) {
      switch (cachedDifficulty) {
        case "easy":
          gameState.difficultyLevel = "easy";
          gameState.movement = 1;
          gameState.spawnInterval = 5000;
          break;
        case "normal":
          gameState.difficultyLevel = "normal";
          gameState.movement = 2;
          gameState.spawnInterval = 4000;
          break;
        case "hard":
          gameState.difficultyLevel = "hard";
          gameState.movement = 3;
          gameState.spawnInterval = 3000;
          break;
      }
      return;
    }

    for (const level in difficulty) {
      if (difficulty[level].status) {
        gameState.difficultyLevel = difficultyLevel;
        gameState.movement = movement;
        gameState.spawnInterval = spawnInterval;
      }
    }
  },
};

difficulty.addDifficultyEventHandler();
difficulty.checkCachedDifficulty();
difficulty.setDifficultyGameState();
difficulty.toggleDifficultyUI();
audio.muteInit();
audio.setAudioSpeed();

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
      ? (this.el.src = `../assets/${el}.png`)
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
  gameState.active = true;
  difficulty.removeDifficultyEventHandler();
  motion.toggleUserInput(gameState.active);
  toggleStatusSign(gameState.active);
  audio.toggleAudio(gameState.active);
  gameLoop(gameState.active);
}

function gameLoop(timestamp) {
  if (gameState.active) {
    motion.moveUser(car, road);

    if (timestamp - gameState.lastSpawnTime > gameState.spawnInterval) {
      createObstacle();
      gameState.lastSpawnTime = timestamp;
    }

    motion.moveSceneObj(activeObstacles, road);
    motion.moveSceneObj(activeScenery, dirt.left);

    if (motion.collisionDetector(car, activeObstacles)) {
      audio.playSoundEffect("death");
      car.el.className = "dead";
      car.el.src = "../assets/skull.png";
      stopGame();
    }

    updateScore(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  gameState.active = false;
  motion.toggleUserInput(gameState.active);
  toggleStatusSign(gameState.active);
  audio.toggleAudio(gameState.active);
}

function createObstacle() {
  const newObstacle = new sceneObj("hole", "img");
  motion.randomLeftPos(newObstacle, road);
  road.el.appendChild(newObstacle.el);
  activeObstacles.push(newObstacle);
}

function toggleStatusSign(gameActive) {
  if (gameActive) {
    gameStatusSign.textContent = `RESTART`;
    gameStatusSign.removeEventListener("click", startGame);
    gameStatusSign.addEventListener("click", resetGame);
  }
}

function resetGame() {
  window.location.reload();
}

function updateScore(scoreInput) {
  let activeScore = scoreInput;

  switch (gameState.difficultyLevel) {
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
