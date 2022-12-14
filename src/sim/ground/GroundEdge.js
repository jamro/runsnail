import * as plank from 'planck';
import { GROUND, OBSTACLE, SNAIL } from '../Collisions';
import SimObject from '../SimObject';

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
  }

  destroy() {
    super.destroy()
    this.world.destroyBody(this.body)
  }

}