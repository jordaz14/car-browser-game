import { helper } from "./modules/helper.js";
import { motion } from "./modules/motion.js";
import { audio } from "./modules/audio.js";
import { environment } from "./modules/environment.js";
import { score } from "./modules/score.js";
import { sayHi } from "./modules/leaderboard.js";

export const gameState = {
  active: false,
  muted: helper.toBoolean(sessionStorage.getItem("muted")),
  difficultyLevel: undefined,
  movement: undefined,
  lastSpawnTime: 0,
  spawnInterval: undefined,
  animationFrameId: 0,
};

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
    motion.moveUser(environment.car, environment.road);

    if (timestamp - gameState.lastSpawnTime > gameState.spawnInterval) {
      environment.createObstacle();
      gameState.lastSpawnTime = timestamp;
    }

    motion.moveSceneObj(environment.activeObstacles, environment.road);
    motion.moveSceneObj(environment.activeScenery, environment.dirt.left);

    if (
      motion.collisionDetector(environment.car, environment.activeObstacles)
    ) {
      audio.playSoundEffect("death");
      environment.car.el.className = "dead";
      environment.car.el.src = "../assets/skull.png";
      stopGame();
    }

    score.updateScore(gameState.animationFrameId);
    gameState.animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  gameState.active = false;
  motion.toggleUserInput(gameState.active);
  toggleStatusSign(gameState.active);
  audio.toggleAudio(gameState.active);
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
