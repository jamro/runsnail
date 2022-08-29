import {getNextSegment, getPrevSegment, getStartSegment} from './GroundShape.js'
import SimContainer from '../SimContainer';
import lineSegment from './segments/lineSegment'
import sineSegment from './segments/sineSegment';
import towerSegment from './segments/towerSegment.js';
import startSegment from './segments/startSegment.js';
import GroundView from '../../view/ground/GroundView';
import rampSegment from './segments/rampSegment.js';
import pyramidSegment from './segments/pyramidSegment.js';

export default class Ground extends SimContainer {

  constructor(world) {
    super()
    this.world = world;
    this.segments = []
    this.view = new GroundView(this)
  }
  
  render() {
    super.render()
    this.view.update()
  }

  build(x, width) {
    let segment
    if(this.segments.length === 0) {
      segment = this.buildSegment(getStartSegment())
      this.segments.push(segment)
      this.emit('addSegment', segment)
    }
    while(this.segments[0].start.x >=  x - width) {
      segment = this.buildSegment(getPrevSegment(this.segments[0]))
      this.segments.unshift(segment)
      this.emit('addSegment', segment)
    }
    while(this.segments[this.segments.length-1].end.x <= x + width) {
      segment = this.buildSegment(getNextSegment(this.segments[this.segments.length-1]))
      this.segments.push(segment)
      this.emit('addSegment', segment)
    }

    while(this.segments[0].end.x < x - width) {
      segment = this.segments.shift()
      segment.destroy()
    }

    while(this.segments[this.segments.length-1].start.x > x + width) {
      segment = this.segments.pop()
      segment.destroy()
    }
  }

  buildSegment(segment) {
    const builders = {
      'start': startSegment,
      'line': lineSegment,
      'sine': sineSegment,
      'tower': towerSegment,
      'ramp': rampSegment,
      'pyramid': pyramidSegment
    }

    if(builders[segment.type]) {
      builders[segment.type](this.world, segment)
    } else {
      throw new Error(`Unknown segment type: ${segment.type}`)
    }
    this.addChild(segment) 
    return segment
  }

}