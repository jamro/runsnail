import * as plank from 'planck/dist/planck-with-testbed';
const Vec2 = plank.Vec2;
const Circle = plank.Circle;

const MIN_SPEED = 3;

export default class Snail {

  constructor(world) {
    this.body = world.createBody().setDynamic();
    this.body.createFixture(Circle(0.5), {
      friction: 0.9,
      density: 1 
    });
    this.body.setPosition(Vec2(0, 10));
    this.body.applyForce(Vec2(1000, 1000), this.body.getPosition())
    this.body.applyTorque(-200)
    this.run = false
  }

  update() {
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
}