import { gameState } from "../main.js";

export const score = {
  active: {
    el: document.querySelector("#active-score"),
    score: 0,
  },
  high: {
    el: document.querySelector("#high-score"),
    score: sessionStorage.getItem("highScore"),

    setHighScore() {
      this.el.textContent = `HIGH SCORE: ${this.score}`;
    },
  },

  updateScore(scoreInput) {
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
    score.active.score = activeScore;

    score.active.el.textContent = `SCORE: ${activeScore}`;

    if (activeScore > score.high.score) {
      sessionStorage.setItem("highScore", activeScore);
      score.high.el.textContent = `High Score: ${activeScore}`;
    }
  },
};

score.high.setHighScore();
