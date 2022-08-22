import * as plank from 'planck/dist/planck-with-testbed';

const Edge = plank.Edge;

export default class GroundEdge {

  constructor(world, startVec, endVec) {
    this.body = world.createBody()
    this.start = startVec
    this.end = endVec
    this.body.createFixture(Edge(startVec, endVec));
  }

}