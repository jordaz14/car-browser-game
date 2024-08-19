import { gameState } from "../gameState.js";

export const score = {
  active: {
    el: document.querySelector("#active-score"),
    count: 0,
  },
  high: {
    el: document.querySelector("#high-score"),
    count: sessionStorage.getItem("highScore") || 0,
  },

  setHighScore() {
    this.high.el.textContent = `PERSONAL HIGH SCORE: ${this.high.count}`;
  },

  // HANDLES ACTIVE AND HIGH SCORE STATE
  updateScore(scoreInput) {
    let activeScore = scoreInput;

    // Adjust score progression based on difficulty level
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

    score.active.count = activeScore;
    score.active.el.textContent = `SCORE: ${activeScore}`;

    // If new score greater than high score
    if (activeScore > score.high.score) {
      // Cache new score
      sessionStorage.setItem("highScore", activeScore);
      // Update high score text
      score.high.el.textContent = `High Score: ${activeScore}`;
    }
  },
};

// Initialize score.js
score.setHighScore();
