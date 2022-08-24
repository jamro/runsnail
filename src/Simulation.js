import * as plank from 'planck/dist/planck-with-testbed';
import Ground from './ground/Ground.js'
import Snail from './Snail.js';
const Vec2 = plank.Vec2;

const WORLD_WIDTH = 500 ;

export default class Simulation {
  constructor() {
    this.world = null
    this.snail = null
    this.ground = null
  }

  init() {
    this.world = plank.World(Vec2(0, -10))
    this.snail = new Snail(this.world)
    this.ground = new Ground(this.world)

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


  update() {
    this.ground.build(this.snail.body.getPosition().x, WORLD_WIDTH)
    this.ground.update() 
    this.snail.update()
  }


}