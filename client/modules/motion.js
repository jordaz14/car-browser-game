import { gameState } from "../gameState.js";
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
    // Add user input if game active
    if (gameActive) {
      // Add keyboard input
      document.addEventListener("keydown", (event) => {
        if (arrowKeys.hasOwnProperty(event.key)) {
          // Update key state
          arrowKeys[event.key] = true;

          // Update UI of arrow icon
          arrowKeys.el[event.key].style.backgroundColor = "black";
          arrowKeys.el[event.key].style.color = "white";
        }
      });
      document.addEventListener("keyup", (event) => {
        if (arrowKeys.hasOwnProperty(event.key)) {
          // Update key state
          arrowKeys[event.key] = false;

          // Update UI of arrow icon
          arrowKeys.el[event.key].style.backgroundColor = "white";
          arrowKeys.el[event.key].style.color = "black";
        }
      });

      // Add mobile input
      document.addEventListener("touchstart", (event) => {
        // If left side of screen touched...
        if (checkTouchLeft(event)) {
          // Update key state
          arrowKeys["ArrowLeft"] = true;

          //Update UI of arrow icon
          arrowKeys.el["ArrowLeft"].style.backgroundColor = "black";
          arrowKeys.el["ArrowLeft"].style.color = "white";
        }
        // If right side of screen touched...
        else {
          //Update key state
          arrowKeys["ArrowRight"] = true;

          //Update UI of arrow icon
          arrowKeys.el["ArrowRight"].style.backgroundColor = "black";
          arrowKeys.el["ArrowRight"].style.color = "white";
        }
      });

      document.addEventListener("touchend", () => {
        //Clear left arrow state
        arrowKeys["ArrowLeft"] = false;
        arrowKeys.el["ArrowLeft"].style.backgroundColor = "white";
        arrowKeys.el["ArrowLeft"].style.color = "black";

        //Clear right arrow state
        arrowKeys["ArrowRight"] = false;
        arrowKeys.el["ArrowRight"].style.backgroundColor = "white";
        arrowKeys.el["ArrowRight"].style.color = "black";
      });
    }
    // Remove user input if game unactive
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

// CHECKS WHERE USER TOUCHES SCREEN
function checkTouchLeft(event) {
  const touch = event.touches[0];
  const touchX = touch.clientX;
  const screenWidth = window.innerWidth;

  if (touchX < screenWidth / 2) {
    return true;
  } else {
    return false;
  }
}
