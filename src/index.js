import InputController from './sim/InputController.js';
import World from './sim/World.js';
import { Application, Graphics, Text } from "pixi.js";
import './style.css'
import WorldView from './view/WorldView.js';

document.addEventListener("DOMContentLoaded", (event) => {

  // model 
  const sim = new World()
  const view = new WorldView(sim)
  const controller = new InputController(document, sim.snail)
  controller.init()

  // rendering
  const sceneContainer = document.querySelector("#scene");
  const app = new Application({
    backgroundAlpha: 0,
    resizeTo: sceneContainer,
    antialias: true,
  });
  document.querySelector("#scene").appendChild(app.view);
  app.stage.addChild(view);

  app.ticker.add((dt) => {
    sim.update(dt, view.groundWidth)
    view.update()
    view.follow(
      sim.snail.body.getPosition().x,
      sim.snail.body.getPosition().y,
      app.renderer.width,
      app.renderer.height
    )
    view.energyBar.value = sim.snail.energy/100
    view.distanceMeter.value = sim.snail.distance
  })

})
