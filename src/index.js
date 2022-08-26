import InputController from './sim/InputController.js';
import Simulation from './Simulation.js';
import { Application, Graphics, Text } from "pixi.js";
import './style.css'

document.addEventListener("DOMContentLoaded", (event) => {

  // model 
  const sim = new Simulation()
  sim.init()
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
  app.stage.addChild(sim.view);

  app.ticker.add((dt) => {
    sim.update(dt)
    sim.render()
    sim.follow(
      sim.snail.body.getPosition().x,
      sim.snail.body.getPosition().y,
      app.renderer.width,
      app.renderer.height
    )
    sim.energyBar.value = sim.snail.energy/100
    sim.distanceMeter.value = sim.snail.distance
  })



})
