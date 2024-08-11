import { gameState } from "../main.js";

export const audio = {
  muteButton: document.querySelector("#mute-button"),

  init() {
    this.muteButton.addEventListener("click", () => this.toggleMute());
  },

  toggleMute() {
    // Set to mute
    if (!gameState.muted) {
      gameState.muted = true;
      sessionStorage.setItem("muted", true);
      this.toggleAudio(gameState.active);
      this.muteButton.textContent = "UNMUTE";
      this.muteButton.style.backgroundColor = "white";
      this.muteButton.style.color = "black";
    }
    // Set to unmute
    else {
      gameState.muted = false;
      sessionStorage.setItem("muted", false);
      this.toggleAudio(gameState.active);
      this.playSoundEffect("select");
      this.muteButton.textContent = "MUTE";
      this.muteButton.style.backgroundColor = "black";
      this.muteButton.style.color = "white";
    }
  },

  muteInit() {
    // If unmuted
    if (!gameState.muted) {
      audio.toggleAudio(gameState.active);
      this.muteButton.textContent = "MUTE";
      this.muteButton.style.backgroundColor = "black";
      this.muteButton.style.color = "white";
      // If muted
    } else {
      audio.toggleAudio(gameState.active);
      this.muteButton.textContent = "UNMUTE";
      this.muteButton.style.backgroundColor = "white";
      this.muteButton.style.color = "black";
    }
  },

  toggleAudio(gameActive) {
    const audioTrack = document.querySelector("#audio-player");

    if (gameActive) {
      if (!gameState.muted) {
        audioTrack.play();
      } else {
        audioTrack.pause();
      }
    } else {
      audioTrack.pause();
    }
  },

  setAudioSpeed() {
    const audioTrack = document.querySelector("#audio-player");
    const cachedDifficulty = sessionStorage.getItem("difficulty");

    switch (cachedDifficulty) {
      case "easy":
        audioTrack.playbackRate = 0.75;
        break;
      case "normal":
        audioTrack.playbackRate = 1;
        break;
      case "hard":
        audioTrack.playbackRate = 1.25;
        break;
      default:
        audioTrack.playbackRate = 1;
        break;
    }
  },

  playSoundEffect(action) {
    if (!gameState.muted) {
      const audioTrack = new Audio();

      switch (action) {
        case "select":
          audioTrack.src = "../../assets/select.mp3";
          audioTrack.play();
          break;
        case "death":
          audioTrack.src = "../../assets/death.mp3";
          audioTrack.play();
          break;
      }
    }
  },
};

audio.init();
