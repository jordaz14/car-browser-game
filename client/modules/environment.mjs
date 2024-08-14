import { motion } from "./motion.mjs";

class sceneObj {
  constructor(el, elType) {
    this.el = document.createElement(elType);
    this.el.className = el;
    elType == "img"
      ? (this.el.src = `./assets/${el}.png`)
      : (this.el.src = null);
    this.rect = this.el.getBoundingClientRect();
  }

  updateRect() {
    this.rect = this.el.getBoundingClientRect();
  }
}

export const environment = {
  sceneObj: sceneObj,
  activeScenery: [],
  activeObstacles: [],
  car: new sceneObj("car", "img"),
  cactus: new sceneObj("cactus", "img"),
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
  createObstacle() {
    const newObstacle = new environment.sceneObj("hole", "img");
    motion.randomLeftPos(newObstacle, this.road);
    this.road.el.appendChild(newObstacle.el);
    this.activeObstacles.push(newObstacle);
  },
  init() {
    this.road.el.appendChild(this.car.el);
    this.dirt.right.el.append(this.cactus.el);
    this.activeScenery.push(this.cactus);
  },
};

environment.init();
