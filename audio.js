export function toggleAudio(gameActive) {
  const audio = document.querySelector("#audio-player");

  gameActive == true ? audio.play() : audio.pause();
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

export function playSoundEffect() {
  const audio = new Audio("assets/one-beep.mp3");

  audio.play();
}
