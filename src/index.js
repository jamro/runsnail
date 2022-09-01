import InputController from './sim/InputController.js';
import World from './sim/World.js';
import { Application, Loader } from "pixi.js";
import './style.css'
import WorldView from './view/WorldView.js';
import SplashScreen from './view/SplashScreen.js';
import mobileCheck from './mobileCheck.js';

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
    view.update()
    view.follow(
      sim.snail,
      app.renderer.width,
      app.renderer.height
    )
    view.energyBar.value = sim.snail.energy/100
    view.distanceMeter.value = sim.snail.distance
    sim.groundWidth = view.groundWidth
  })
  app.stage.addChild(view);
  sim.start()

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
  let music = null

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
    controller.view = worldView
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
    controller.view = worldView

    if(mobileCheck()) {
      document.documentElement.requestFullscreen();
    }
    
    music = new Howl({
      src: ['sfx/bg.mp3'],
      html5: true,
      loop: true,
      volume: 0.15,
    });
    music.play();
  })

  const splash = new SplashScreen()
  app = createPixiApp(() => {
    splash.update(app.renderer.width, app.renderer.height)
  })
  controller.view = splash
  app.stage.addChild(splash)

  Loader.shared
    .add('coin', 'coin.png')
    .load(() => console.log('assets loaded'));
  
})
