import { gameState } from "../main.js";
import { helper } from "./helper.js";

// HOLDS STATE OF ARROW KEYS
const arrowKeys = {
  ArrowLeft: false,
  ArrowRight: false,
  el: {
    ArrowLeft: document.querySelector("#left-arrow"),
    ArrowRight: document.querySelector("#right-arrow"),
  },
};

export const motion = {
  // ENABLES/DISABLES USER MOVEMENT
  toggleUserInput(gameActive) {
    // Add keyboard input if game active
    if (gameActive) {
      document.addEventListener("keydown", (event) => {
        if (arrowKeys.hasOwnProperty(event.key)) {
          arrowKeys[event.key] = true;
          arrowKeys.el[event.key].style.backgroundColor = "black";
          arrowKeys.el[event.key].style.color = "white";
        }
      });
      document.addEventListener("keyup", (event) => {
        if (arrowKeys.hasOwnProperty(event.key)) {
          arrowKeys[event.key] = false;
          arrowKeys.el[event.key].style.backgroundColor = "white";
          arrowKeys.el[event.key].style.color = "black";
        }
      });
    }
    // Remove keyboard input if game unactive
    else {
      document.removeEventListener("keydown", (event) => {
        if (arrowKeys.hasOwnPropert(event.key)) {
          arrowKeys[event.key] = true;
        }
      });
      document.removeEventListener("keyup", (event) => {
        if (arrowKeys.hasOwnProperty(event.key)) {
          arrowKeys[event.key] = false;
        }
      });
    }
  },

  //HANDLES USER MOVEMENT
  moveUser(movingObj, scene) {
    const MOVEMENT = 10;

    // Get the current position from the object's rect
    movingObj.updateRect();

    // Calculate object width
    const objWidth = movingObj.rect.width;

    // If left arrow key active
    if (arrowKeys.ArrowLeft) {
      // If object within bounds
      if (movingObj.rect.left - MOVEMENT >= scene.rect.left) {
        // Move left
        movingObj.el.style.left = `${
          movingObj.rect.left - scene.rect.left - MOVEMENT
        }px`;
      } else {
        // Restrict within bounds
        movingObj.el.style.left = `${0}px`;
      }
    }

    // If right arrow key active
    if (arrowKeys.ArrowRight) {
      // If object within bounds
      if (movingObj.rect.right + MOVEMENT <= scene.rect.right) {
        // Move right
        movingObj.el.style.left = `${
          movingObj.rect.left - scene.rect.left + MOVEMENT
        }px`;
      } else {
        // Restrict within bounds
        movingObj.el.style.left = `${
          scene.rect.right - objWidth - scene.rect.left
        }px`;
      }
    }
  },

  //HANDLES OBSTACLE & SCENERY MOVEMENT
  moveSceneObj(activeObjsArr, scene) {
    // Establish y-axis positioning & movement speed
    const OFFSET = 200;
    const MOVEMENT = gameState.movement;

    // Iterate through every object in environment
    for (const activeObj of activeObjsArr) {
      // Move object downwards
      let currentTop = parseInt(activeObj.el.style.top) || 0;
      currentTop += MOVEMENT;
      activeObj.el.style.top = `${currentTop}%`;
      activeObj.updateRect();

      // Check if object is out of scene bounds
      if (activeObj.rect.bottom > scene.rect.height + OFFSET) {
        // Update position of object
        currentTop = scene.rect.top;
        motion.randomLeftPos(activeObj, scene);
        activeObj.el.style.top = `${currentTop - OFFSET}px`;
        activeObj.updateRect();
      }
    }
  },

  //HANDLES COLLISIONS
  collisionDetector(movingObj, activeObjsArr) {
    movingObj.updateRect();

    //Iterate through every active object in environment
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
  },

  //HANDLES X-POSITION SPAWNING
  randomLeftPos(movingObj, scene) {
    movingObj.el.style.left = `${helper.getRandomInt(
      0,
      scene.rect.width - movingObj.el.offsetWidth
    )}px`;
  },
};
