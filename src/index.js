import {
  Engine, 
  Runner,
  Common,
} from "matter-js";
import { Application } from "pixi.js";
import Ball from "./Ball.js";
import GameWorld from "./GameWorld.js";
import 'poly-decomp'

import Ground from "./Ground.js";

document.addEventListener("DOMContentLoaded", (event) => {
  const sceneContainer = document.querySelector(".scene");
  Common.setDecomp(require('poly-decomp'))
  const engine = Engine.create();

  const app = new Application({
    backgroundAlpha: 0,
    resizeTo: sceneContainer,
  });
  document.querySelector(".scene").appendChild(app.view);

  const gameWorld = new GameWorld(engine, app);

  const snail = new Ball({x: 100, y: 50, radius: 25, restitution: 0})
  
  gameWorld.add(snail);
  gameWorld.cameraLock = snail;
  
  const ground = new Ground()
  gameWorld.add(ground);

  gameWorld.on('tick', () => {
    ground.scroll(sceneContainer.clientWidth, snail.physicBody.position.x)
  })
  
  Runner.run(engine);

});