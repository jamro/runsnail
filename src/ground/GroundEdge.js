import { Graphics } from 'pixi.js';
import * as plank from 'planck/dist/planck-with-testbed';
import { GROUND, OBSTACLE, SNAIL } from '../Collisions';
import SimObject from '../sim/SimObject';

const Edge = plank.Edge;

export default class GroundEdge extends SimObject {

  constructor(world, start, end) {
    super()
    this.world = world
    this.start = start
    this.end = end
    this.body = world.createBody().setStatic() 
    const fixture = this.body.createFixture(Edge(start, end), {
      friction: 0.9,
      filterCategoryBits: GROUND,
      filterMaskBits: GROUND | SNAIL | OBSTACLE
    });
    fixture.objRef = this 

    this.view = new Graphics()
    this.view.beginFill(0x000000)
    this.view.lineTo(start.x, start.y)
    this.view.lineTo(end.x, end.y)
    this.view.lineTo(end.x, end.y - 1000)
    this.view.lineTo(start.x, start.y - 1000)
    this.view.lineTo(start.x, start.y)
  }

  destroy() {
    super.destroy()
    this.world.destroyBody(this.body)
  }

}