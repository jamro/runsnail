import * as plank from 'planck/dist/planck-with-testbed';
import {EventEmitter} from 'events'

const Circle = plank.Circle;
const Vec2 = plank.Vec2;

export default class Coin extends EventEmitter {

  constructor(world, x, y) {
    super()
    this.x = x
    this.y = y
    this.collected = false
    this.body = world.createBody().setStatic()
    const fixture = this.body.createFixture(Circle(0.5), {
       isSensor: true
    });
    fixture.objRef = this
    this.body.setPosition(Vec2(x, y));
  }

  collect() {
    this.collected = true
  }
}