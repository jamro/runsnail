import { Graphics } from 'pixi.js';
import * as plank from 'planck/dist/planck-with-testbed';
import { SNAIL } from './Collisions';
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
      isSensor: true,
      filterCategoryBits: SNAIL,
      filterMaskBits: SNAIL
    });
    fixture.objRef = this
    this.body.setPosition(Vec2(this.x, this.y));

    this.view = new Graphics ()
    this.view.beginFill(0xffaa00)
    this.view.drawCircle(0, 0, 0.3)
    this.render()
  }

  render() {
    this.view.x = this.body.getPosition().x
    this.view.y = this.body.getPosition().y
  }

  collect() {
    this.collected = true
  }

  destroy() {
    super.destroy()
    this.world.destroyBody(this.body)
  }

  update() {
    if(this.collected) {
      this.destroy()
    }
  }
}