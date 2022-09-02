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
    app.ticker.maxFPS = 60
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
  
  app.stage.addChild(splash)

  Loader.shared
    .add('coin', 'coin.png')
    .add('body', 'body.png')
    .add('shell', 'shell.png')
    .add('eye', 'eye.png')
    .add('cloud', 'cloud.png')
    .add('replay', 'replay.png')
    .add('distance', 'distance.png')
    .add('distanceMeter', 'distanceMeter.png')
    .add('energy', 'energy.png')
    .add('tutorial_hold', 'tutorial_hold.png')
    .add('tutorial_dive', 'tutorial_dive.png')
    .add('tutorial_release', 'tutorial_release.png')
    .add('tutorial_flyup', 'tutorial_flyup.png')
    .add('sound', 'sound.png')
    .load((loader) => {
      console.log('Assets loaded')
      splash.progress = loader.progress
      controller.init()
      controller.view = splash
    })


  Loader.shared.onLoad.add((loader, resource) => {
    console.log(`Loading ${resource.url}... (${loader.progress.toFixed(1)}%)`)
    splash.progress = loader.progress
  })
  Loader.shared.onError.add((error, loader, resource) => {
    console.log(`Error ${resource.url}... (${loader.progress.toFixed(1)}%)`, error)
    splash.loadingStatus = "Error: Unable to load " + resource.url
    splash.progress = loader.progress
  })
  
})
