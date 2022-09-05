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

document.addEventListener("DOMContentLoaded", (event) => {
  let world
  let app
  let worldView

  const controller = new InputController(document)
  controller.init()
  controller.enabled = false

  const startGame = (tutorial) => {
    if(world) {
      world.destroy()
    }
    if(worldView) {
      worldView.destroy()
    }
    if(app) {
      app.destroy(true)
    }

    world = new World(tutorial)
    worldView = new WorldView(world)

    world.snail.on('gameOver', () => {
      controller.enabled = false
    })
    world.snail.on('replayPrompt', () => {
      controller.hook = () => startGame()
      controller.enabled = true
    })
  
    app = createPixiApp((dt) => {
      worldView.update()
      worldView.follow(
        world.snail,
        app.renderer.width,
        app.renderer.height
      )
      worldView.energyBar.value = world.snail.energy/100
      worldView.distanceMeter.value = world.snail.distance
      world.groundWidth = worldView.groundWidth
    })
    app.stage.addChild(worldView);
    world.start()
  
    worldView.start()
    controller.world = world
    controller.view = worldView

    if(tutorial) {
      controller.hook = () => {
        world.infoActive = false
      }
    }

  }

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
      controller.enabled = true
      controller.view = splash
      controller.hook = () => {
        if(mobileCheck()) {
          document.documentElement.requestFullscreen();
        }
        startGame(true)
      }
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
