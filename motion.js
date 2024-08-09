import { getRandomInt } from "./helper.js";

export function collisionDetector(movingObj, activeObjsArr) {
  movingObj.updateRect();

  for (const activeObj of activeObjsArr) {
    activeObj.updateRect();

    const isColliding = !(
      movingObj.rect.right < activeObj.rect.left ||
      movingObj.rect.left > activeObj.rect.right ||
      movingObj.rect.bottom < activeObj.rect.top ||
      movingObj.rect.top > activeObj.rect.bottom
    );

    if (isColliding) {
      return true;
    }
  }

  return false;
}

export function randomLeftPos(movingObj, scene) {
  movingObj.el.style.left = `${getRandomInt(
    0,
    scene.rect.width - movingObj.el.offsetWidth
  )}px`;
}
