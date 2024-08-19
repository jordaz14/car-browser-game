import { helper } from "./modules/helper.js";

export const gameState = {
  active: false,
  muted: helper.toBoolean(sessionStorage.getItem("muted")),
  difficultyLevel: "normal",
  movement: 2,
  lastSpawnTime: 0,
  spawnInterval: 4000,
  animationFrameId: 0,
};
