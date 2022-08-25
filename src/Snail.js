import * as plank from 'planck/dist/planck-with-testbed';
import Coin from './Coin';
import { GROUND, OBSTACLE, SNAIL } from './Collisions';
import Dust from './Dust';
import GroundEdge from './ground/GroundEdge';
import SimObject from './sim/SimObject';
import SnailView from './SnailView';
const Vec2 = plank.Vec2;
const Circle = plank.Circle;

export const SNAIL_MIN_SPEED = 2.5;
const ROLLING = 'rolling'
const GLIDING = 'gliding'
const WALKING = 'walking'

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
    this.coins = 0
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
    this.pusher.setPosition(this.body.getPosition());
    if(this.run) {
      this.body.applyForce(Vec2(0, -30), this.body.getPosition())
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

    
    if(this.walkingMode) { 
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
        this.view.dust.enabled = true
        this.view.dust.rotation = Math.atan2(this.groundNormal.y, this.groundNormal.x) - Math.PI/2
      } else {
        this.view.dust.enabled = false
      }
    }
  }

  render() {
    this.view.x = this.body.getPosition().x
    this.view.y = this.body.getPosition().y
    this.view.rotation = this.body.getAngle()
    this.view.update()
  }

  contact(obj, contact) {
    if(obj.constructor === Coin && !obj.collected) {
      this.coins++
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
}