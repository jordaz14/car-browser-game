import { gameState } from "./gameState.js";
import { helper } from "./modules/helper.js";
import { motion } from "./modules/motion.js";
import { audio } from "./modules/audio.js";
import { environment } from "./modules/environment.js";
import { score } from "./modules/score.js";
import { difficulty } from "./modules/difficulty.js";
import { leaderboard } from "./modules/leaderboard.js";

// SELECT GAME OPTIONS CONTAINER & START BUTTON
let options = document.querySelector(".options");
let startButton = document.querySelector(".start-button");
startButton.addEventListener("click", startGame);

// START CAR GAME ON
function startGame() {
  gameState.active = true;

  // Change start button to restart
  createRestartButton(gameState.active);

  // Hides game options if mobile
  helper.checkScreenWidth(1200) ? (options.style.display = "none") : null;

  // Restricts difficulty toggle in-game
  difficulty.removeDifficultyEventHandler();

  // Enable user to move car
  motion.toggleUserInput(gameState.active);

  // Plays music if not on mute
  audio.toggleAudio(gameState.active);

  gameLoop(gameState.active);
}

// LOOP THROUGH CAR GAME AT BROWSER FRAMERATE
function gameLoop(timestamp) {
  if (gameState.active) {
    // Moves car based on state of user input
    motion.moveUser(environment.car, environment.road);

    // Spawn obstacles
    if (timestamp - gameState.lastSpawnTime > gameState.spawnInterval) {
      environment.createObstacle();
      gameState.lastSpawnTime = timestamp;
    }

    // Move obstacles and scenery
    motion.moveSceneObj(environment.activeObstacles, environment.road);
    motion.moveSceneObj(environment.activeScenery, environment.dirt.left);

    // Check collisions
    if (
      motion.collisionDetector(environment.car, environment.activeObstacles)
    ) {
      audio.playSoundEffect("death");
      environment.car.el.className = "dead-car";
      environment.car.el.src = "./assets/img/skull.png";
      stopGame();
    }

    // Update score
    score.updateScore(gameState.animationFrameId);
    gameState.animationFrameId = requestAnimationFrame(gameLoop);
  }
}

// END CAR GAME
function stopGame() {
  gameState.active = false;

  // Show game options if mobile
  helper.checkScreenWidth(1200) ? (options.style.display = "flex") : null;

  // Restrict user from moving car
  motion.toggleUserInput(gameState.active);

  // End game music if unmuted
  audio.toggleAudio(gameState.active);
}

// RESET CAR GAME BY PAGE RELOAD
function resetGame() {
  window.location.reload();
}

// CHANGE START BUTTON TO RESTART BUTTON
function createRestartButton(gameActive) {
  if (gameActive) {
    startButton.textContent = `RESTART`;
    startButton.removeEventListener("click", startGame);
    startButton.addEventListener("click", resetGame);
  }
}

//Initialize leaderboard.js
leaderboard();
