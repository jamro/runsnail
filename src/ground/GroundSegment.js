import SimContainer from "../sim/SimContainer"

export default class GroundSegment extends SimContainer {

  constructor(type, start, end) {
    super()
    this.type = type
    this.start = start
    this.end = end
  }

}