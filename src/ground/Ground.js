import GroundEdge from './GroundEdge.js';
import {getNextSegment, getPrevSegment, getStartSegment} from './GroundShape.js'
import Coin from '../Coin.js';
import SimContainer from '../sim/SimContainer';

export default class Ground extends SimContainer {

  constructor(world) {
    super()
    this.world = world;
    this.segments = []
  }

  build(x, width) {
    let segment
    if(this.segments.length === 0) {
      segment = this.buildSegment(getStartSegment())
      this.segments.push(segment)
      this.addChild(segment)
    }
    while(this.segments[0].start.x > x - width/2) {
      segment = this.buildSegment(getPrevSegment(this.segments[0]))
      this.segments.unshift(segment)
      this.addChild(segment)
    }
    while(this.segments[this.segments.length-1].end.x < x + width/2) {
      segment = this.buildSegment(getNextSegment(this.segments[this.segments.length-1]))
      this.segments.push(segment)
      this.addChild(segment) 
    }

    while(this.segments[0].end.x < x - width/2) {
      this.segments.shift().destroy()
    }

    while(this.segments[this.segments.length-1].start.x > x + width/2) {
      this.segments.pop().destroy()
    }
  }

  buildSegment(segment) {
    const edge = new GroundEdge( this.world, segment)
    segment.addChild(edge)
    if(segment.type === 'coin') {
      const coin = new Coin(this.world, segment)
      segment.addChild(coin)
    }
    return segment
  }

}