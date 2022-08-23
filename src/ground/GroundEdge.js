import * as plank from 'planck/dist/planck-with-testbed';
import SimObject from '../sim/SimObject';

const Edge = plank.Edge;

export default class GroundEdge extends SimObject {

  constructor(world, segment) {
    super()
    this.world = world
    this.start = segment.start
    this.end = segment.end
    this.body = world.createBody().setStatic() 
    this.segment = segment
    const fixture = Edge(this.segment.start, this.segment.end)
    this.body.createFixture(fixture, {
      friction: 0.9
    });
  }

  destroy() {
    this.world.destroyBody(this.body)
  }

}