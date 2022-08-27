import * as plank from 'planck';
import Ground from './ground/Ground.js'
import SimContainer from './SimContainer.js';
import Snail, { SNAIL_MIN_SPEED } from './Snail.js';
const Vec2 = plank.Vec2;

export default class World extends SimContainer {
  constructor() {
    super()
    this.world = null
    this.snail = null
    this.ground = null

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
 
  update(dt, groundWidth) {
    super.update(dt)
    this.world.step(1/60);
    this.ground.build(this.snail.body.getPosition().x, groundWidth)
  }

}