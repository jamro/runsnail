import { Graphics } from 'pixi.js';
import * as plank from 'planck/dist/planck-with-testbed';
import { GROUND, OBSTACLE } from './Collisions';
import SimObject from './sim/SimObject';
import Snail from './Snail';

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

    this.view = this.drawStick(length)
    this.view.beginFill(0x000000)
   
    this.render()
  }

  drawStick(length) {
    const graphics = new Graphics()
    graphics.beginFill(0x000000)
    const topWidth = 0.048 + Math.random()*0.04
    const bottomWidth = 0.048 + Math.random()*0.04
    const shifts = Array(Math.floor(Math.random()*3)).fill(0).map(() => 0.08*Math.random()-0.04)
    const segmentLength = length / (shifts.length + 1)
    let i

    graphics.moveTo(-topWidth, -length/2)
    graphics.lineTo(topWidth, -length/2)
    for(i = 0; i < shifts.length; i++) {
      graphics.lineTo(0.05 + shifts[i], -length/2 + (i+1) * segmentLength)
    }
    graphics.lineTo(bottomWidth, length/2)
    graphics.lineTo(-bottomWidth, length/2)
    for(i = shifts.length-1; i >= 0; i--) {
      graphics.lineTo(-0.05 + shifts[i], -length/2 + (i+1) * segmentLength)
    }
    graphics.moveTo(-topWidth, -length/2)

    if(Math.random() > 0.8) {
      graphics.moveTo(0, -0.03+0.05)
      graphics.lineTo(0.15, -0.15+0.05)
      graphics.lineTo(0.15, -0.11+0.05)
      graphics.lineTo(0, 0.03+0.05)
    }

    if(Math.random() > 0.8) {
      graphics.moveTo(0, -0.03-0.05)
      graphics.lineTo(-0.15, -0.15-0.05)
      graphics.lineTo(-0.15, -0.11-0.05)
      graphics.lineTo(0, 0.03-0.05)
    }
    return graphics
  }

  render() {
    this.view.x = this.body.getPosition().x
    this.view.y = this.body.getPosition().y
    this.view.rotation = this.body.getAngle()
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