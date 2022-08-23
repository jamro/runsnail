import * as plank from 'planck/dist/planck-with-testbed';

const Edge = plank.Edge;

export default class GroundEdge {

  constructor(world, startVec, endVec) {
    this.body = world.createBody().setStatic() 
    this.start = startVec
    this.end = endVec
    const fixture = Edge(startVec, endVec)
    this.body.createFixture(fixture, {
      friction: 0.9
    });
  }

}