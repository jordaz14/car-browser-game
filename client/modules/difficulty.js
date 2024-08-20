import { gameState } from "../gameState.js";
import { audio } from "./audio.js";

export const difficulty = {
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

// Initialize difficulty.js
difficulty.addDifficultyEventHandler();
difficulty.checkCachedDifficulty();
difficulty.setDifficultyGameState();
difficulty.toggleDifficultyUI();
