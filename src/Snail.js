import * as plank from 'planck/dist/planck-with-testbed';
import Coin from './Coin';
import { GROUND, OBSTACLE, SNAIL } from './Collisions';
import SimObject from './sim/SimObject';
const Vec2 = plank.Vec2;
const Circle = plank.Circle;

const MIN_SPEED = 3;

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
  }

  update() {
    this.pusher.setPosition(this.body.getPosition());
    if(this.run) {
      this.body.applyForce(Vec2(0, -30), this.body.getPosition())
    }
    const snailSpeed = this.body.getLinearVelocity().x
    if(snailSpeed < MIN_SPEED) {
      this.body.applyForce(Vec2({
        x: 30 * (MIN_SPEED - snailSpeed),
        y: 0
      }), this.body.getPosition())
    }
  }

  contact(obj) {
    if(obj.constructor === Coin && !obj.collected) {
      this.coins++
      obj.collect()
    }
  }

  destroy() {
    this.world.destroyBody(this.body)
  }
}