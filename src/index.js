import InputController from './sim/InputController.js';
import World from './sim/World.js';
import { Application, Loader } from "pixi.js";
import './style.css'
import WorldView from './view/WorldView.js';
import SplashScreen from './view/SplashScreen.js';
import mobileCheck from './mobileCheck.js';
import SoundPlayer from './SoundPlayer.js';

const VERSION = '1.0.2'

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  alert("Error occured: " + errorMsg);//or any message
  return false;
}

function goFullScreen(elem) {
  if (elem.requestFullScreen) {
    elem.requestFullScreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullScreen) {
    elem.webkitRequestFullScreen();
  }
}

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
    SoundPlayer.shared.reset() 

    world = new World(tutorial)
    worldView = new WorldView(world)

    world.snail.on('gameOver', (data) => {
      if(localStorage) {
        const bestResult = Number(localStorage.getItem('bestResult')) || 0
        if(data.distance > bestResult) {
          localStorage.setItem('bestResult', data.distance)
        }
      }
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

  const splash = new SplashScreen(VERSION)
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
    .add('rotate', 'rotate.png')
    .load((loader) => {
      if(Loader.shared.loadingError) {
        return
      }
      console.log('Assets loaded')
      splash.progress = loader.progress
      controller.enabled = true
      controller.view = splash
      controller.hook = () => {
        if(mobileCheck()) {
          goFullScreen(document.documentElement)
        }
        splash.progress = 0
        controller.enabled = false
        splash.loadingStatus = 'Loading audio...'
        SoundPlayer.shared.load()
      }
    })
  splash.loadingStatus = 'Loading graphics...'

  Loader.shared.onLoad.add((loader, resource) => {
    console.log(`Loading ${resource.url}... (${loader.progress.toFixed(1)}%)`)
    splash.progress = loader.progress
  })
  Loader.shared.onError.add((error, loader, resource) => {
    console.log(`Error ${resource.url}... (${loader.progress.toFixed(1)}%)`, error)
    splash.loadingStatus = "Error: Unable to load " + resource.url
    splash.progress = loader.progress
    Loader.shared.loadingError = true
  })


  SoundPlayer.shared.add('fly', {
    src: [`sfx/fly.mp3`],
    sprite:{
      fly1: [0, 1000],
      fly2: [1000, 1000],
      fly3: [2000, 1000],
      fly4: [3000, 1000],
      fly5: [4000, 1000],
      fly6: [5000, 1000],
      fly7: [6000, 1000],
      fly8: [7000, 1000],
      fly9: [8000, 1000],
      start: [4120, 800],
    }
  })
  SoundPlayer.shared.add('roll', {
    src: ['sfx/roll.mp3'],
    volume: 0,
    loop: true
  })
  SoundPlayer.shared.add('wind', {
    src: ['sfx/wind.mp3'],
    volume: 0,
    loop: true
  })
  SoundPlayer.shared.add('walk', {
    src: ['sfx/walk.mp3'],
    volume: 0,
    loop: true
  })
  SoundPlayer.shared.add('sleep', {
    src: ['sfx/sleep.mp3'],
    volume: 0,
    loop: true
  })
  SoundPlayer.shared.add('hit', {
    src: ['sfx/hit.mp3']
  })
  SoundPlayer.shared.add('hitsoft', {
    src: ['sfx/hitsoft.mp3'],
    volume: 0.2
  })
  SoundPlayer.shared.add('powerdown', {
    src: [`sfx/powerdown.mp3`],
    volume: 0.9
  })
  SoundPlayer.shared.add('coin', {
    src: [`sfx/coin.mp3`],
    volume: 0.1,
  })
  SoundPlayer.shared.add('tweet', {
    src: [`sfx/tweet.mp3`],
    volume: 0,
    loop: true
  })
  SoundPlayer.shared.add('crack', {
    src: [`sfx/crack.mp3`],
    volume: 0.3,
    sprite: {
      crack1: [130, 210],
      crack2: [600, 300],
      crack3: [1000, 600],
      crack4: [1500, 800],
      crack5: [1800, 1000],
      crack6: [3100, 400],
    }
  })
  SoundPlayer.shared.add('bg', {
    src: ['sfx/bg.mp3'],
    html5: true,
    loop: true,
    volume: 0.15,
  })

  SoundPlayer.shared.on('progress', (progress) => {
    splash.progress = progress
  })
  SoundPlayer.shared.on('loaded', () => {
    splash.progress = 100
    controller.enabled = true
    startGame(true)
  })
  SoundPlayer.shared.on('error', (error) => {
    console.log(`Error...`, error)
    splash.loadingStatus = "Error: Unable to load audio"
  })

  
  
})
