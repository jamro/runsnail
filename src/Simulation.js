import { Sprite, Text } from 'pixi.js';
import * as plank from 'planck/dist/planck-with-testbed';
import Dust from './Dust.js';
import Ground from './ground/Ground.js'
import SimContainer from './sim/SimContainer.js';
import Snail, { SNAIL_MIN_SPEED } from './Snail.js';
const Vec2 = plank.Vec2;

const WORLD_WIDTH = 500 ;

export default class Simulation extends SimContainer {
  constructor() {
    super()
    this.world = null
    this.snail = null
    this.ground = null
    this.viewContainer = new Sprite()
    this.view.addChild(this.viewContainer)
    this.zoom = 50

    this.statusText = new Text('Score: 0', {fontFamily : 'Arial', fontSize: 24, fill : 0x000000});
    this.view.addChild(this.statusText)
    this.yShift = 0.5
  }

  set status(text) {
    this.statusText.text = text
  }

  get status() {
    return this.statusText.text
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
    this.ground.build(this.snail.body.getPosition().x, WORLD_WIDTH)
  }

  follow(x, y, width, height) {


    const v = Math.max(this.snail.body.getLinearVelocity().x, SNAIL_MIN_SPEED )
    const timeHorizon = 4 // seconds
    const distanceHorizon = v * timeHorizon

    const targetZoom = Math.min(60,  width / distanceHorizon)

    if(this.zoom < targetZoom) {
      this.zoom += Math.min(0.1, (targetZoom - this.zoom) * 0.001)
    } else {
      this.zoom += Math.max(-0.1 , (targetZoom - this.zoom) * 0.01)
    }

    if(this.snail.isOnGround) {
      this.yShift += Math.min(0.0005,  (0.5 - this.yShift) * 0.05)
    } else {
      this.yShift += Math.max(-0.0005, (0.2  - this.yShift) * 0.01)
    }

    this.viewContainer.x = -x * this.viewContainer.scale.x + width / 4
    this.viewContainer.y = -y * this.viewContainer.scale.y + height * this.yShift

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