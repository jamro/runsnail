import { Sprite } from "pixi.js";
import { DEAD, SNAIL_MIN_SPEED } from "../sim/Snail";
import Background from "./ground/Background";
import DistanceMeter from "./DistanceMeter";
import EnergyBar from "./EnergyBar";
import View from "./View";
import SnailView from "./SnailView";
import GroundView from "./ground/GroundView";
import Tutorial from "./Tutorial";
import InfoScreen from "./InfoScreen";
import SoundSwitch from "./SoundSwitch";
import FpsCounter from "./FpsCounter";

export default class WorldView extends View {
  
  constructor(model) {
    super(model)
    this.background = new Background()
    this.addChild(this.background)

    this.viewContainer = new Sprite()
    this.addChild(this.viewContainer)
    this.zoom = 50

    this.yShift = 0.5
    this.xShift = 0.18
    this.groundWidth = 500

    this.ground = new GroundView(this.model.ground)
    this.viewContainer.addChild(this.ground)

    this.snail = new SnailView(this.model.snail)
    this.viewContainer.addChild(this.snail)

    this.energyBar = new EnergyBar()
    this.energyBar.x = 10;
    this.energyBar.y = 10;
    this.addChild(this.energyBar)

    this.distanceMeter = new DistanceMeter()
    this.distanceMeter.x = 250;
    this.distanceMeter.y = 9;
    this.addChild(this.distanceMeter)


    this.tutorial = null
    this.infoScreen = null
    if(this.model.tutorial) {
      this.tutorial = new Tutorial()
      this.tutorial.visible = false
      this.addChild(this.tutorial)
      this.infoScreen = new InfoScreen()
      this.addChild(this.infoScreen)
    }

    this.soundSwitch = new SoundSwitch()
    this.addChild(this.soundSwitch)

    //this.fps = new FpsCounter()
    //this.addChild(this.fps)

  }

  set zoom(factor) {
    this.viewContainer.scale.x = factor
    this.viewContainer.scale.y = -factor
  }

  get zoom() {
    return this.viewContainer.scale.x
  }

  update() {
    //this.fps.tick()
    //this.fps.info = `TPS: ${this.model.ticksPerSecond.toFixed(1)}`
    if(this.model.onHold) {
      this.snail.dust.enabled = false
      return
    }
    this.snail.update()
    this.ground.update()
  }

  follow(snail, width, height) {
    if(this.infoScreen) {
      this.infoScreen.resize(width, height)
    }
    if(this.infoScreen && !this.model.infoActive) {
      this.removeChild(this.infoScreen)
      this.infoScreen = null
    }
    this.soundSwitch.x = width - 40
    this.soundSwitch.y = 30
    if(this.tutorial && !this.infoScreen) {
      this.tutorial.visible = true
      this.tutorial.y = height - 180
      const snailX = snail.body.getPosition().x
      if(snailX < 5) {
        this.tutorial.page = 1
      } else if(snailX >= 5 && snailX < 10) {
        this.tutorial.page = 2
      } else if(snailX > 35) {
        this.removeChild(this.tutorial)
        this.tutorial = null
      }
    }
    if(this.model.onHold) {
      return
    }
    this.energyBar.visible = !this.infoScreen
    this.distanceMeter.visible = !this.infoScreen
    const x = snail.body.getPosition().x
    const y = snail.body.getPosition().y
    this.background.follow(x, y, width, height)

    let vx = this.model.snail.body.getLinearVelocity().x
    let vy = this.model.snail.body.getLinearVelocity().y
    let v = Math.sqrt(vx * vx + vy * vy) 
    v = Math.max(v, SNAIL_MIN_SPEED)
    const timeHorizon = 4 // seconds
    const distanceHorizon = v * timeHorizon

    const targetZoom = Math.min(60,  width / distanceHorizon)

    if(this.zoom < targetZoom) {
      this.zoom += Math.min(0.1, (targetZoom - this.zoom) * 0.001)
    } else {
      this.zoom += Math.max(-0.1 , (targetZoom - this.zoom) * 0.01)
    }

    if(this.model.snail.state === DEAD) {
      this.yShift += Math.min(0.0005,  (0.8 - this.yShift) * 0.08)
      this.xShift += Math.min(0.0005,  (0.5 - this.xShift) * 0.08)
    } else if(this.model.snail.isOnGround) {
      this.yShift += Math.min(0.0005,  (0.6 - this.yShift) * 0.05)
    } else {
      this.yShift += Math.max(-0.0005, (0.3  - this.yShift) * 0.8)
    }

    let targetX
    let targetY

    targetX = -x * this.viewContainer.scale.x + width * this.xShift
    targetY = -y * this.viewContainer.scale.y + height * this.yShift
    this.viewContainer.x = targetX
    this.viewContainer.y += (targetY - this.viewContainer.y) * 0.3
    this.groundWidth = width / this.viewContainer.scale.x     
  }
}
