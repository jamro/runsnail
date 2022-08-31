import InputController from './sim/InputController.js';
import World from './sim/World.js';
import { Application, Graphics, Text } from "pixi.js";
import './style.css'
import WorldView from './view/WorldView.js';
import SplashScreen from './view/SplashScreen.js';


function createPixiApp(loop) {
  const sceneContainer = document.querySelector("#scene");
  const app = new Application({
    backgroundAlpha: 0,
    resizeTo: sceneContainer,
    antialias: true,
  });
  document.querySelector("#scene").appendChild(app.view);

  if(loop) {
    app.ticker.add((dt) => loop(dt))
  }
  return app
}


function startNewGame(tutorial) {
  const sim = new World(tutorial)
  const view = new WorldView(sim)

  const app = createPixiApp((dt) => {
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
  app.stage.addChild(view);

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
    if(world) {
      world.destroy()
    }
    if(app) {
      app.destroy(true)
    }
    const { model, pixiApp, view } = startNewGame()
    world = model
    app = pixiApp
    worldView = view
    controller.world = world
  })
  controller.on("start", () => {
    if(world) {
      world.destroy()
    }
    if(app) {
      app.destroy(true)
    }
    const { model, pixiApp, view } = startNewGame(true)
    world = model
    app = pixiApp
    worldView = view
    controller.world = world
  })

  
  const splash = new SplashScreen()
  app = createPixiApp(() => {
    splash.update(app.renderer.width, app.renderer.height)
  })
  app.stage.addChild(splash)
  
})
