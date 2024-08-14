import { helper } from "./modules/helper.mjs";
import { motion } from "./modules/motion.mjs";
import { audio } from "./modules/audio.mjs";
import { environment } from "./modules/environment.mjs";
import { score } from "./modules/score.mjs";
import { init } from "./modules/leaderboard.mjs";

export const gameState = {
  active: false,
  muted: helper.toBoolean(sessionStorage.getItem("muted")),
  difficultyLevel: "normal",
  movement: 2,
  lastSpawnTime: 0,
  spawnInterval: 4000,
  animationFrameId: 0,
};

// HANDLES GAME DIFFICULTY (to be modularized)
const difficulty = {
  easy: {
    el: document.querySelector("#easy-button"),
    status: false,
    movement: 1,
    spawnInterval: 5000,
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
    movement: 2,
    spawnInterval: 4000,
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
    movement: 3,
    spawnInterval: 3000,
    handleClick: function () {
      difficulty.toggleDifficultyStatus(this);
      difficulty.toggleDifficultyUI();
      difficulty.setDifficultyGameState("hard", 3, 3000);
      audio.playSoundEffect("select");
      audio.setAudioSpeed();
    },
  },

  // ADDS CLICK EVENT LISTENER TO EVERY DIFFICULTY LEVEL
  addDifficultyEventHandler() {
    for (const level in difficulty) {
      if (difficulty[level].el) {
        // Binds hanadle click to correct context of difficulty level
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

  // REMOVES CLICK LISTENER FROM EVERY DIFFICULTY LEVEL
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

  // HANDLES DIFFICULTY STATUS STATE
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

  // HANDLES UI OF DIFFICULTY BUTTONS
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

  setDifficultyGameState() {
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
        gameState.difficultyLevel = level;
        gameState.movement = difficulty[level].movement;
        gameState.spawnInterval = difficulty[level].spawnInterval;
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

let startButton = document.querySelector(".game-status-sign");
startButton.addEventListener("click", startGame);
let gameCard = document.querySelector(".game-card");

function startGame() {
  gameState.active = true;
  checkScreenWidth(1200) ? (gameCard.style.display = "none") : null;
  difficulty.removeDifficultyEventHandler();
  motion.toggleUserInput(gameState.active);
  toggleStatusSign(gameState.active);
  audio.toggleAudio(gameState.active);
  gameLoop(gameState.active);
}

function gameLoop(timestamp) {
  if (gameState.active) {
    // Enable user movement
    motion.moveUser(environment.car, environment.road);

    // Checks spawning
    if (timestamp - gameState.lastSpawnTime > gameState.spawnInterval) {
      environment.createObstacle();
      gameState.lastSpawnTime = timestamp;
    }

    // Enable obstacle and scenery movement
    motion.moveSceneObj(environment.activeObstacles, environment.road);
    motion.moveSceneObj(environment.activeScenery, environment.dirt.left);

    // Check collisions
    if (
      motion.collisionDetector(environment.car, environment.activeObstacles)
    ) {
      audio.playSoundEffect("death");
      environment.car.el.className = "dead";
      environment.car.el.src = "./assets/skull.png";
      stopGame();
    }

    // Update score
    score.updateScore(gameState.animationFrameId);
    gameState.animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  gameState.active = false;
  checkScreenWidth(1200) ? (gameCard.style.display = "flex") : null;
  motion.toggleUserInput(gameState.active);
  toggleStatusSign(gameState.active);
  audio.toggleAudio(gameState.active);
}

//HANDLES UI OF START BUTTON
function toggleStatusSign(gameActive) {
  if (gameActive) {
    startButton.textContent = `RESTART`;
    startButton.removeEventListener("click", startGame);
    startButton.addEventListener("click", resetGame);
  }
}

function resetGame() {
  window.location.reload();
}

function checkScreenWidth(inputWidth) {
  const screenWidth = window.innerWidth;

  if (screenWidth < inputWidth) {
    return true;
  } else {
    return false;
  }
}
