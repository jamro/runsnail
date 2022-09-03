import * as plank from 'planck';
import Ground from './ground/Ground.js'
import SimContainer from './SimContainer.js';
import Snail, { STARTING } from './Snail.js';
const Vec2 = plank.Vec2;

export default class World extends SimContainer {
  constructor(tutorial) {
    super()

    this.tutorial = tutorial
    this.infoActive = tutorial
    this.onHold = false
    this.active = true
    this.world = plank.World(Vec2(0, -10))
    this.snail = new Snail(this.world)
    this.ground = new Ground(this.world)
    this.addChild(this.snail)
    this.addChild(this.ground)

    this.snail.body.setPosition(Vec2(0.5, 0.45))
    this.snail.body.setAngle(-0.3)
    this.groundWidth = 500
    this.loop = null;
    this.ticks = 0
    this.ticksPerSecond = 0
    this.lastTickFlush = 0

    this.snail.on('gameOver', () => {
      console.log('GAME OVER')
      console.log(`Distance: ${this.snail.distance.toFixed(1)}m`)
      this.active = false
    })

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

  start() {
    this.loop = setInterval(() => this.update(1/60), 8)
  }
 
  update(dt) {
    this.ticks++
    const now = new Date().getTime()
    const dts = (now - this.lastTickFlush) / 1000
    if(dts > 1) {
      this.ticksPerSecond = this.ticks / dts
      this.ticks = 0
      this.lastTickFlush = now
    }

    if(!this.active) {
      return
    }

    // tutorial controls
    if(this.tutorial) {
      const snailX = this.snail.body.getPosition().x
      if(snailX > 1 && snailX < 4 && !this.snail.run) {
        this.onHold = true
        return
      } else if(snailX >= 4 && snailX < 8 && this.snail.run) {
        this.onHold = true
        return
      } else if(snailX >= 8 && snailX < 30 && this.snail.run) {
        this.snail.run = false
        this.onHold = false
      }
      this.onHold = false
    }
    super.update(dt)
    this.world.step(dt);
    this.ground.build(this.snail.body.getPosition().x, this.groundWidth)
    if(this.snail.state === STARTING) {
      this.snail.body.setAwake(false)
    }
  }

  destroy() {
    super.destroy()
    if(this.loop) {
      clearInterval(this.loop)
    }
  }

}