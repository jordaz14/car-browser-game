import { gameState } from "../gameState.js";

export const audio = {
  muteButton: document.querySelector("#mute-button"),

  // ADD EVENT LISTENER TO MUTE BUTTON
  init() {
    this.muteButton.addEventListener("click", () => this.toggleMute());
  },

  // HANDLES MUTE STATE
  toggleMute() {
    if (!gameState.muted) {
      //Set to mute state
      gameState.muted = true;

      // Cache muted state
      sessionStorage.setItem("muted", true);

      // Mute audio
      this.toggleAudio(gameState.active);

      //Inverse styling of mute button
      this.muteButton.textContent = "UNMUTE";
      this.muteButton.style.backgroundColor = "white";
      this.muteButton.style.color = "black";
    } else if (gameState.muted) {
      //Set to unmuted state
      gameState.muted = false;

      // Cache muted state
      sessionStorage.setItem("muted", false);

      //Unmute audio
      this.toggleAudio(gameState.active);
      this.playSoundEffect("select");

      //Inverse styling of mute button
      this.muteButton.textContent = "MUTE";
      this.muteButton.style.backgroundColor = "black";
      this.muteButton.style.color = "white";
    }
  },

  // HANDLES MUTE STATE ON INITIAL LOAD
  muteInit() {
    if (!gameState.muted) {
      //Unmute audio
      audio.toggleAudio(gameState.active);

      //Inverse styling of mute button
      this.muteButton.textContent = "MUTE";
      this.muteButton.style.backgroundColor = "black";
      this.muteButton.style.color = "white";
    } else if (gameState.muted) {
      audio.toggleAudio(gameState.active);

      //Inverse styling of mute button
      this.muteButton.textContent = "UNMUTE";
      this.muteButton.style.backgroundColor = "white";
      this.muteButton.style.color = "black";
    }
  },

  // HANDLES AUDIO PLAYER
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

  // HANDLES PLAYBACK SPEED
  setAudioSpeed() {
    const audioTrack = document.querySelector("#audio-player");
    const cachedDifficulty = sessionStorage.getItem("difficulty");

    //Check cached difficulty, adjust playback speed accordingly
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

  // HANDLES SOUND EFFECTS
  playSoundEffect(action) {
    if (!gameState.muted) {
      const audioTrack = new Audio();

      switch (action) {
        case "select":
          audioTrack.src = "./assets/audio/select.mp3";
          audioTrack.play();
          break;
        case "death":
          audioTrack.src = "./assets/audio/death.mp3";
          audioTrack.play();
          break;
      }
    }
  },
};

audio.init();
audio.muteInit();
audio.setAudioSpeed();
