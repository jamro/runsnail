import {getNextSegment, getPrevSegment, getStartSegment} from './GroundShape.js'
import SimContainer from '../sim/SimContainer';
import lineSegment from './segments/lineSegment'
import sineSegment from './segments/sineSegment';
import towerSegment from './segments/towerSegment.js';


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

    const builders = {
      'line': lineSegment,
      'sine': sineSegment,
      'tower': towerSegment
    }

    if(builders[segment.type]) {
      builders[segment.type](this.world, segment)
    } else {
      throw new Error(`Unknown segment type: ${segment.type}`)
    }
    return segment
  }

}