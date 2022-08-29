import * as plank from 'planck';
import Coin from './ground/Coin';
import { GROUND, OBSTACLE, SNAIL } from './Collisions';
import GroundEdge from './ground/GroundEdge';
import SimObject from './SimObject';
const Vec2 = plank.Vec2;
const Circle = plank.Circle;

export const SNAIL_MIN_SPEED = 2.5;
export const STARTING = 'starting'
export const ROLLING = 'rolling'
export const GLIDING = 'gliding'
export const WALKING = 'walking'
export const DEAD = 'dead'

export default class Snail extends SimObject {

  constructor(world) {
    super()
    this.world = world
    this.body = world.createBody().setDynamic();
    this.bodyFixture = this.body.createFixture(Circle(0.5), {
      friction: 0.9,
      density: 1,
      restitution: 0.1,
      filterCategoryBits: SNAIL,
      filterMaskBits: GROUND  | SNAIL
    });
    this.bodyFixture.objRef = this
    this.body.setPosition(Vec2(0, 0));

    this.pusher = world.createBody().setKinematic();
    let fixture = this.pusher.createFixture(Circle(0.4), {
      friction: 0,
      density: 1,
      filterCategoryBits: OBSTACLE,
      filterMaskBits: OBSTACLE
    });
    fixture.objRef = this
    this.pusher.setPosition(this.body.getPosition());

    this._run = false
    this.energy = 100
    this.onGroundCounter = 0
    this.flyTimer = 0
    this.isOnGround = false
    this.state = STARTING
    this.walkingMode = false
    this._distance = 0
    this.enabled = false
    this.groundNormal = Vec2(0, 1)
  }

  set run(value) {
    if(!this.enabled) {
      this.body.applyAngularImpulse(-1)
      this.body.applyLinearImpulse(Vec2(2, -2), this.body.getPosition())
    }
    this._run = value
    this.enabled = true
  }

  get run() {
    return this._run
  }

  update() {
    if(!this.enabled) {
      return
    } 
    const powerConsumption = 0.02 + this.body.getPosition().x/300000

    this.energy = Math.max(0, this.energy - powerConsumption)

    this.pusher.setPosition(this.body.getPosition());
    if(this.run && this.energy > 0) {
      this.body.applyForce(Vec2(0, -30), this.body.getPosition())
      this.energy = Math.max(0, this.energy - powerConsumption)
    }
    const snailSpeed = this.body.getLinearVelocity().x

    if(this.flyTimer > 5) {
      this.isOnGround = false
    }
    if(this.onGroundCounter > 0) {
      this.flyTimer = 0
      this.isOnGround = true
    } else {
      this.flyTimer++
    }

    if(!this.isOnGround) {
      this.body.applyForce(Vec2(0, 2), this.body.getPosition())
    }

    if(this.flyTimer > 50 && snailSpeed > SNAIL_MIN_SPEED) {
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

    if(snailSpeed <= SNAIL_MIN_SPEED) {
      this.walkingMode = true
    }
    if(snailSpeed > SNAIL_MIN_SPEED*1.1) {
      this.walkingMode = false
    }

    if(this.walkingMode && this.energy > 0) { 
      this.bodyFixture.setFriction(0)
      this.body.applyForce(Vec2({
        x: 30 * (SNAIL_MIN_SPEED - snailSpeed),
        y: 0
      }), this.body.getPosition())
      const targetAngle = Math.atan2(this.groundNormal.y, this.groundNormal.x) - Math.PI/2
      let angleDiff = (targetAngle - this.body.getAngle()) % (2 * Math.PI)
      while(angleDiff > 0.5*Math.PI) {
        angleDiff -= 2 * Math.PI
      }
      while(angleDiff < -1.5*Math.PI) {
        angleDiff += 2 * Math.PI
      }
      this.body.setAngularVelocity(0)
      this.body.setAngle(this.body.getAngle() + angleDiff/10)
    } else {
      this.bodyFixture.setFriction(0.9)
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

    if(this.energy <= 0 && this.isOnGround) {
      this.state = DEAD

      const linearVelocity = this.body.getLinearVelocity()

      this.body.applyForce(Vec2(
        -linearVelocity.x,
        -linearVelocity.y
      ).mul(1), this.body.getPosition())
      this.bodyFixture.setFriction(1)

      if(linearVelocity.x < 0.05) {
        this.emit('gameOver')
      }
    }
    this._distance = Math.max(this._distance, 0.05*(this.body.getPosition().x))
  }

  contact(obj, contact) {
    if(obj.constructor === Coin && !obj.collected && this.energy > 0) {
      this.energy = Math.min(100, this.energy + 1)
      obj.collect()
    }
    if(obj.constructor === GroundEdge) {
      this.onGroundCounter++
      const normal = contact.getManifold().localNormal
      if(normal.x !== 0 || normal.y !== 0) {
        this.groundNormal = normal
      }
    }
  }

  separate(obj) {
    if(obj.constructor === GroundEdge) {
      this.onGroundCounter--
    }
  }

  destroy() {
    super.destroy()
    this.world.destroyBody(this.body)
  }

  // in meters
  get distance() {
    return this._distance
  }
}