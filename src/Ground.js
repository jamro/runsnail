import { Body } from "matter-js";
import GameContainer from "./GameContainer.js";
import GroundSegment from "./GroundSegment";

export default class Ground extends GameContainer {

  constructor(props = {}) {
    super(props)
    this.segments = []
  }

  scroll(width, center) {
    let segment;
    if(this.segments.length === 0) {
      segment = new GroundSegment({ x: center, y: 300 })
      this.segments.push(segment)
      this.addChild(segment);
    }

    while(this.segments[0].startPoint.x > center - width/2) {
      segment = new GroundSegment()
      const segmentWidth = (segment.endPoint.x - segment.startPoint.x)
      const segmentHeight = (segment.endPoint.y - segment.startPoint.y)
      const newX = this.segments[0].startPoint.x - segmentWidth
      const newY = this.segments[0].startPoint.y - segmentHeight

      segment.moveTo(newX, newY)

      this.segments.unshift(segment)
      this.addChild(segment);
    }

    while(this.segments[this.segments.length-1].endPoint.x < center + width/2) {
      segment = new GroundSegment({
        x: this.segments[this.segments.length-1].endPoint.x,
        y: this.segments[this.segments.length-1].endPoint.y
      })
      this.segments.push(segment)
      this.addChild(segment);
    }


    while(this.segments[0].endPoint.x < center - width/2) {
      this.removeChild(this.segments.shift());
    }
    while(this.segments[this.segments.length-1].startPoint.x > center + width/2) {
      this.removeChild(this.segments.pop());
    }

    console.log(`Segment count: ${this.segments.length}`)
  }

}