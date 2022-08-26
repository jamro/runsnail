import * as plank from 'planck/dist/planck-with-testbed';
import Coin from './Coin';
import { GROUND, OBSTACLE, SNAIL } from './Collisions';
import GroundEdge from './ground/GroundEdge';
import SimObject from './sim/SimObject';
import SnailView from './view/SnailView';
const Vec2 = plank.Vec2;
const Circle = plank.Circle;

export const SNAIL_MIN_SPEED = 2.5;
const ROLLING = 'rolling'
const GLIDING = 'gliding'
const WALKING = 'walking'
const DEAD = 'dead'

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
    this.body.setPosition(Vec2(0, 10));

    this.pusher = world.createBody().setKinematic();
    let fixture = this.pusher.createFixture(Circle(0.4), {
      friction: 0,
      density: 1,
      filterCategoryBits: OBSTACLE,
      filterMaskBits: OBSTACLE
    });
    fixture.objRef = this
    this.pusher.setPosition(Vec2(0, 5));

    this.run = false
    this.energy = 100
    this.onGroundCounter = 0
    this.flyTimer = 0
    this.isOnGround = false
    this.state = ROLLING
    this.walkingMode = false

    this.view = new SnailView()
    this.render()
    this.groundNormal = Vec2(0, 1)
  }

  update() {
    const powerConsumption = 0.02 + this.body.getPosition().x/200000

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
      this.view.dust.enabled = false
      this.view.hidden = false
      if(this.isOnGround) {
        this.state = WALKING
      } else {
        this.state = GLIDING
      }
    } else {
      this.state = ROLLING
      this.view.hidden = true
      if(this.isOnGround) {
        this.view.dust.enabled = (this.energy > 0)
        this.view.dust.rotation = Math.atan2(this.groundNormal.y, this.groundNormal.x) - Math.PI/2
      } else {
        this.view.dust.enabled = false
      }
    }

    if(this.energy <= 0 && this.isOnGround) {
      this.state = DEAD
      this.view.hidden = true

      this.body.applyForce(Vec2(
        -this.body.getLinearVelocity().x,
        -this.body.getLinearVelocity().y
      ).mul(1), this.body.getPosition())
      this.bodyFixture.setFriction(1)

    }
  }

  render() {
    this.view.x = this.body.getPosition().x
    this.view.y = this.body.getPosition().y
    this.view.rotation = this.body.getAngle()
    this.view.update()
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
    return this.body.getPosition().x * 0.05
  }
}