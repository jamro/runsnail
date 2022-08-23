import * as plank from 'planck/dist/planck-with-testbed';
import SimObject from '../sim/SimObject';

const Edge = plank.Edge;

export default class GroundEdge extends SimObject {

  constructor(world, start, end) {
    super()
    this.world = world
    this.start = start
    this.end = end
    this.body = world.createBody().setStatic() 
    const fixture = Edge(start, end)
    this.body.createFixture(fixture, {
      friction: 0.9
    });
  }

  destroy() {
    this.world.destroyBody(this.body)
  }

}