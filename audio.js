import { gameState } from "./main.js";

const muteButton = document.querySelector("#mute-button");
muteButton.addEventListener("click", toggleMute);

function toggleMute() {
  // Set to mute
  if (!gameState.muted) {
    console.log("muted");
    gameState.muted = true;
    sessionStorage.setItem("muted", true);
    toggleAudio(gameState.active);
    muteButton.textContent = "UNMUTE";
    muteButton.style.backgroundColor = "white";
    muteButton.style.color = "black";
  }
  // Set to unmute
  else {
    console.log("unmuted");
    gameState.muted = false;
    sessionStorage.setItem("muted", false);
    toggleAudio(gameState.active);
    playSoundEffect("select");
    muteButton.textContent = "MUTE";
    muteButton.style.backgroundColor = "black";
    muteButton.style.color = "white";
  }
}

export function muteInit() {
  // If unmuted
  console.log(gameState.muted);
  console.log(!gameState.muted);
  if (!gameState.muted) {
    toggleAudio(gameState.active);
    muteButton.textContent = "MUTE";
    muteButton.style.backgroundColor = "black";
    muteButton.style.color = "white";
    // If muted
  } else {
    toggleAudio(gameState.active);
    muteButton.textContent = "UNMUTE";
    muteButton.style.backgroundColor = "white";
    muteButton.style.color = "black";
  }
}

export function toggleAudio(gameActive) {
  const audio = document.querySelector("#audio-player");

  if (gameActive) {
    console.log(gameState.muted);
    if (!gameState.muted) {
      audio.play();
    } else {
      audio.pause();
    }
  } else {
    audio.pause();
  }
}

export function setAudioSpeed() {
  const audio = document.querySelector("#audio-player");
  const cachedDifficulty = sessionStorage.getItem("difficulty");

  switch (cachedDifficulty) {
    case "easy":
      audio.playbackRate = 0.75;
      break;
    case "normal":
      audio.playbackRate = 1;
      break;
    case "hard":
      audio.playbackRate = 1.25;
      break;
    default:
      audio.playbackRate = 1;
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
