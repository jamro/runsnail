import * as plank from 'planck/dist/planck-with-testbed';
import Coin from './Coin';
import { GROUND, OBSTACLE, SNAIL } from './Collisions';
import GroundEdge from './ground/GroundEdge';
import SimObject from './sim/SimObject';
const Vec2 = plank.Vec2;
const Circle = plank.Circle;

const MIN_SPEED = 3;
const ROLLING = 'rolling'
const GLIDING = 'gliding'
const WALKING = 'walking'

export default class Snail extends SimObject {

  constructor(world) {
    super()
    this.world = world
    this.body = world.createBody().setDynamic();
    let fixture = this.body.createFixture(Circle(0.5), {
      friction: 0.9,
      density: 1,
      filterCategoryBits: SNAIL,
      filterMaskBits: GROUND  | SNAIL
    });
    fixture.objRef = this
    this.body.setPosition(Vec2(0, 10));
    this.body.applyLinearImpulse(Vec2(20, 10), this.body.getPosition())
    this.body.applyTorque(-200)

    this.pusher = world.createBody().setKinematic();
    fixture = this.pusher.createFixture(Circle(0.4), {
      friction: 0.9,
      density: 1,
      filterCategoryBits: OBSTACLE,
      filterMaskBits: OBSTACLE
    });
    fixture.objRef = this
    this.pusher.setPosition(Vec2(0, 10));

    this.run = false
    this.coins = 0
    this.onGroundCounter = 0
    this.flyTimer = 0
    this.isOnGround = false
    this.state = ROLLING
  }

  update() {
    this.pusher.setPosition(this.body.getPosition());
    if(this.run) {
      this.body.applyForce(Vec2(0, -30), this.body.getPosition())
      this.body.applyTorque(-4)
    }
    const snailSpeed = this.body.getLinearVelocity().x
    if(snailSpeed < MIN_SPEED) {
      this.body.applyForce(Vec2({
        x: 30 * (MIN_SPEED - snailSpeed),
        y: 0
      }), this.body.getPosition())
      const v = this.body.getLinearVelocity()
      this.body.setAngle(Math.atan2(v.y, v.x))
      if(!this.run) {
         this.body.setAngularVelocity(0)
      }
    } 

    if(this.flyTimer > 10) {
      this.isOnGround = false
    }
    if(this.onGroundCounter > 0) {
      this.flyTimer = 0
      this.isOnGround = true
    } else {
      this.flyTimer++
    }

    if(this.flyTimer > 100) {
      let a = this.body.getAngle()
      const v = this.body.getLinearVelocity()
      const targetA = Math.atan2(v.y, v.x) / Math.PI * 180
      a = Math.round(a / Math.PI * 180) % 360
      let dt = targetA - a
      while(dt > 0) {
        dt -= 360
      }
      while(dt < -360) {
        dt += 360
      }
      this.body.setAngularVelocity(0.1*dt)
    }

    const av = this.body.getAngularVelocity()
    if(Math.abs(av) < 5) {
      if(this.isOnGround) {
        this.state = WALKING
      } else {
        this.state = GLIDING
      }
    } else {
      this.state = ROLLING
    }
  }

  contact(obj) {
    if(obj.constructor === Coin && !obj.collected) {
      this.coins++
      obj.collect()
    }
    if(obj.constructor === GroundEdge) {
      this.onGroundCounter++
    }
  }

  separate(obj) {
    if(obj.constructor === GroundEdge) {
      this.onGroundCounter--
    }
  }

  destroy() {
    this.world.destroyBody(this.body)
  }
}