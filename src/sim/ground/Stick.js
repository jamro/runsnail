import * as plank from 'planck';
import { GROUND, OBSTACLE } from '../Collisions';
import SimObject from '../SimObject';
import Snail from '../Snail';

const Box = plank.Box;
const Vec2 = plank.Vec2;

export default class Stick extends SimObject {
  constructor(world, length, x, y, angle) {
    super();
    this.world = world
    this.x = x || 0
    this.y = y || 0
    this.angle = angle || 0
    this.length = length
    this.body = world.createBody().setDynamic()
    const fixture = this.body.createFixture(Box(0.05 , length/2), {
      density: 0.1,
      friction: 0.9,
      filterCategoryBits: OBSTACLE,
      filterMaskBits: GROUND | OBSTACLE
    });
    fixture.objRef = this
    this.body.setPosition(Vec2(this.x, this.y));
    this.body.setAngle(this.angle);
  }
  
  destroy() {
    super.destroy()
    this.world.destroyBody(this.body)
  }

  contact(other, contact) {
    if(other.constructor !== Snail) {
      return
    }
    const manifold = contact.getManifold()
    this.body.applyForce (other.body.getLinearVelocity().clone().mul(0.3), this.body.getPosition().add(manifold.localPoint) ) 
  }
}  