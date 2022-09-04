import {getNextSegment, getPrevSegment, getStartSegment} from './GroundShape.js'
import SimContainer from '../SimContainer';
import lineSegment from './segments/lineSegment'
import sineSegment from './segments/sineSegment';
import towerSegment from './segments/towerSegment.js';
import startSegment from './segments/startSegment.js';
import GroundView from '../../view/ground/GroundView';
import rampSegment from './segments/rampSegment.js';
import pyramidSegment from './segments/pyramidSegment.js';
import halfSineSegment from './segments/halfSineSegment.js';
import bridgeSegment from './segments/bridgeSegment.js';
import atzodSegment from './segments/atzodSegment.js';
import gapSegment from './segments/gapSegment.js';

export default class Ground extends SimContainer {

  constructor(world) {
    super()
    this.world = world;
    this.segments = []
    this.view = new GroundView(this)
    this.elevation = 0
    this.targetElevation = 0
  }
  
  update() {
    super.update()
    this.elevation += (this.targetElevation - this.elevation) * 0.01
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
    this.targetElevation = this.segments.reduce((min, segment) => Math.min(min, segment.yMin), Infinity)
  }

  buildSegment(segment) {
    const builders = {
      'start': startSegment,
      'line': lineSegment,
      'sine': sineSegment,
      'halfSine': halfSineSegment,
      'tower': towerSegment,
      'ramp': rampSegment,
      'pyramid': pyramidSegment,
      'bridge': bridgeSegment,
      'atzod': atzodSegment,
      'gap': gapSegment
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