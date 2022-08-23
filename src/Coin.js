import * as plank from 'planck/dist/planck-with-testbed';
import SimObject from './sim/SimObject';

const Circle = plank.Circle;
const Vec2 = plank.Vec2;

export default class Coin extends SimObject {

  constructor(world, x, y) {
    super()
    this.world = world
    this.x = x
    this.y = y
    this.collected = false
    this.body = world.createBody().setStatic()
    const fixture = this.body.createFixture(Circle(0.5), {
       isSensor: true
    });
    fixture.objRef = this
    this.body.setPosition(Vec2(this.x, this.y));
  }

  collect() {
    this.collected = true
  }

  destroy() {
    this.world.destroyBody(this.body)
  }

  update() {
    if(this.collected) {
      this.destroy()
    }
  }
}