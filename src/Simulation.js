import { Sprite, Text } from 'pixi.js';
import * as plank from 'planck/dist/planck-with-testbed';
import Ground from './ground/Ground.js'
import SimContainer from './sim/SimContainer.js';
import Snail, { SNAIL_MIN_SPEED } from './Snail.js';
import Background from './view/Background.js';
import EnergyBar from './view/EnergyBar.js';
import DistanceMeter from './view/DistanceMeter.js';
const Vec2 = plank.Vec2;

export default class Simulation extends SimContainer {
  constructor() {
    super()
    this.world = null
    this.snail = null
    this.ground = null
    this.background = new Background()
    this.view.addChild(this.background)
    this.viewContainer = new Sprite()
    this.view.addChild(this.viewContainer)
    this.zoom = 50

    this.yShift = 0.5
    this.groundWidth = 500

    this.energyBar = new EnergyBar()
    this.energyBar.x = 10;
    this.energyBar.y = 10;
    this.view.addChild(this.energyBar)

    this.distanceMeter = new DistanceMeter()
    this.distanceMeter.x = 250;
    this.distanceMeter.y = 9;
    this.view.addChild(this.distanceMeter)
  }

  set zoom(factor) {
    this.viewContainer.scale.x = factor
    this.viewContainer.scale.y = -factor
  }

  get zoom() {
    return this.viewContainer.scale.x
  }

  init() {
    this.world = plank.World(Vec2(0, -10))
    this.snail = new Snail(this.world)
    this.ground = new Ground(this.world)
    this.addChild(this.snail)
    this.addChild(this.ground)

    this.world.on('begin-contact', (contact) => {
      const objA = contact.getFixtureA().objRef
      const objB = contact.getFixtureB().objRef
  
      if(!objA || !objB) {
        return
      } 
      if(objA.contact) {
        objA.contact(objB, contact)
      }
      if(objB.contact) {
        objB.contact(objA, contact)
      }
    })
  
    this.world.on('end-contact', (contact) => {
      const objA = contact.getFixtureA().objRef
      const objB = contact.getFixtureB().objRef
      if(!objA || !objB) {
        return
      } 
      if(objA.separate) {
        objA.separate(objB, contact)
      }
      if(objB.separate) {
        objB.separate(objA, contact)
      }
    })
  }

  update(dt) {
    super.update(dt)
    this.world.step(1/60);
    this.ground.build(this.snail.body.getPosition().x, this.groundWidth)
  }

  follow(x, y, width, height) {
    this.background.follow(x, y, width, height)
    let vx = this.snail.body.getLinearVelocity().x
    let vy = this.snail.body.getLinearVelocity().y
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

    if(this.snail.isOnGround) {
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

  addChild(child) {
    this.children.push(child)
    child.parent = this
    if(child.view) {
      this.viewContainer.addChild(child.view)
    }
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child)
    child.parent = null
    if(child.view) {
      this.viewContainer.removeChild(child.view)
    }
  }

}