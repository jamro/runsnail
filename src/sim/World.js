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
 
  update(dt, groundWidth) {
    if(!this.active) {
      return
    }

    // tutorial controls
    if(this.tutorial) {
      const snailX = this.snail.body.getPosition().x
      if(snailX > 1 && snailX < 5 && !this.snail.run) {
        this.onHold = true
        return
      } else if(snailX >= 5 && snailX < 10 && this.snail.run) {
        this.onHold = true
        return
      } else if(snailX >= 10 && snailX < 30 && this.snail.run) {
        this.snail.run = false
      }
      this.onHold = false

    }

    super.update(dt)
    this.world.step(1/60);
    this.ground.build(this.snail.body.getPosition().x, groundWidth)
    if(this.snail.state === STARTING) {
      this.snail.body.setAwake(false)
    }
  }

}