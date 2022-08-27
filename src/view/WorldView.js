import { Sprite } from "pixi.js";
import { SNAIL_MIN_SPEED } from "../sim/Snail";
import Background from "./ground/Background";
import DistanceMeter from "./DistanceMeter";
import EnergyBar from "./EnergyBar";
import View from "./View";
import SnailView from "./SnailView";
import GroundView from "./ground/GroundView";

export default class WorldView extends View {
  
  constructor(model) {
    super(model)
    this.background = new Background()
    this.addChild(this.background)

    this.viewContainer = new Sprite()
    this.addChild(this.viewContainer)
    this.zoom = 50

    this.yShift = 0.5
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
  }

  set zoom(factor) {
    this.viewContainer.scale.x = factor
    this.viewContainer.scale.y = -factor
  }

  get zoom() {
    return this.viewContainer.scale.x
  }

  update() {
    this.snail.update()
    this.ground.update()
  }

  follow(x, y, width, height) {
    this.background.follow(x, y, width, height)

    let vx = this.model.snail.body.getLinearVelocity().x
    let vy = this.model.snail.body.getLinearVelocity().y
    let v = Math.sqrt(vx * vx + vy * vy) 
    v = Math.max(v, SNAIL_MIN_SPEED)
    const timeHorizon = 5 // seconds
    const distanceHorizon = v * timeHorizon

    const targetZoom = Math.min(60,  width / distanceHorizon)

    if(this.zoom < targetZoom) {
      this.zoom += Math.min(0.1, (targetZoom - this.zoom) * 0.001)
    } else {
      this.zoom += Math.max(-0.1 , (targetZoom - this.zoom) * 0.01)
    }

    if(this.model.snail.isOnGround) {
      this.yShift += Math.min(0.0005,  (0.6 - this.yShift) * 0.05)
    } else {
      this.yShift += Math.max(-0.0005, (0.4  - this.yShift) * 0.08)
    }

    const targetX = -x * this.viewContainer.scale.x + width / 4
    const targetY = -y * this.viewContainer.scale.y + height * this.yShift

    this.viewContainer.x = targetX
    this.viewContainer.y += (targetY - this.viewContainer.y) * 0.3

    this.groundWidth = width / this.viewContainer.scale.x 
  }
}