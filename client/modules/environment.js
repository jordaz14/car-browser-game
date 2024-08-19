import { motion } from "./motion.js";

// CONSTRUCTOR FOR CAR, OBSTACLES, & SCENERY
class sceneObj {
  constructor(el) {
    // Create image with class
    this.el = document.createElement("img");
    this.el.className = el;
    this.el.src = `./assets/img/${el}.png`;

    // Set position
    this.rect = this.el.getBoundingClientRect();
  }

  // Update position
  updateRect() {
    this.rect = this.el.getBoundingClientRect();
  }
}

export const environment = {
  // Import sceneObj constructor
  sceneObj: sceneObj,

  // Contains all active elements in scenery (i.e. dirt)
  activeScenery: [],

  // Contains all octive elements on road
  activeObstacles: [],

  car: new sceneObj("car"),
  cactus: new sceneObj("cactus"),

  road: {
    el: document.querySelector(".road"),
    rect: document.querySelector(".road").getBoundingClientRect(),
  },

  dirt: {
    left: {
      el: document.querySelector(".dirt-left"),
      rect: document.querySelector(".dirt-left").getBoundingClientRect(),
    },
    right: {
      el: document.querySelector(".dirt-right"),
      rect: document.querySelector(".dirt-right").getBoundingClientRect(),
    },
  },

  // CREATES NEW OBSTACLES
  createObstacle() {
    const newObstacle = new environment.sceneObj("hole");

    // Assign x-position on spawn
    motion.randomLeftPos(newObstacle, this.road);
    // Append to road
    this.road.el.appendChild(newObstacle.el);
    // Push to all active obstacles
    this.activeObstacles.push(newObstacle);
  },

  // ADDS CAR & CACTUS TO ENVIRONMENT
  createEnvironment() {
    this.road.el.appendChild(this.car.el);
    this.dirt.right.el.append(this.cactus.el);
    this.activeScenery.push(this.cactus);
  },
};

// Initialize environment.js
environment.createEnvironment();
