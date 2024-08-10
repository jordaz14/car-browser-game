import { gameState } from "./main.js";

const muteButton = document.querySelector("#mute-button");
muteButton.addEventListener("click", toggleMute);

function toggleMute() {
  // Set to mute
  if (!gameState.muted) {
    gameState.muted = true;
    toggleAudio(gameState.active);
    muteButton.textContent = "UNMUTE";
    muteButton.style.backgroundColor = "white";
    muteButton.style.color = "black";
  }
  // Set to unmute
  else {
    gameState.muted = false;
    toggleAudio(gameState.active);
    playSoundEffect("select");
    muteButton.textContent = "MUTE";
    muteButton.style.backgroundColor = "black";
    muteButton.style.color = "white";
  }
}

export function toggleAudio(gameActive) {
  const audio = document.querySelector("#audio-player");

  if (gameActive) {
    if (!gameState.muted) {
      audio.play();
    } else {
      audio.pause();
    }
  } else {
    audio.pause();
  }
}

export function setAudioSpeed(speed) {
  const audio = document.querySelector("#audio-player");

  switch (speed) {
    case "slow":
      audio.playbackRate = 0.75;
      break;
    case "normal":
      audio.playbackRate = 1;
      break;
    case "fast":
      audio.playbackRate = 1.25;
      break;
  }
}

export function playSoundEffect(action) {
  if (!gameState.muted) {
    const audio = new Audio();

    switch (action) {
      case "select":
        audio.src = "assets/select.mp3";
        audio.play();
        break;
      case "death":
        audio.src = "assets/death.mp3";
        audio.play();
        break;
    }
  }
}
