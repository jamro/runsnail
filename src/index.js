import InputController from './sim/InputController.js';
import World from './sim/World.js';
import { Application, Graphics, Text } from "pixi.js";
import './style.css'
import WorldView from './view/WorldView.js';


function startNewGame(tutorial) {
  const sim = new World(tutorial)
  const view = new WorldView(sim)

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
      sim.snail,
      app.renderer.width,
      app.renderer.height
    )
    view.energyBar.value = sim.snail.energy/100
    view.distanceMeter.value = sim.snail.distance
  })
  return {
    model: sim,
    view: view,
    pixiApp: app,
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  let world
  let app
  let worldView

  const controller = new InputController(document)
  controller.init()
  controller.on("replay", () => {
    if(!world || !app || !worldView) {
      return
    }
    world.destroy()
    app.destroy(true)

    const { model, pixiApp, view } = startNewGame()
    world = model
    app = pixiApp
    worldView = view
    controller.world = world
  })

  const { model, pixiApp, view } = startNewGame(true)
  world = model
  app = pixiApp
  worldView = view
  controller.world = world

})
