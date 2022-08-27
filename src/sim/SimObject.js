import { EventEmitter } from "events"

export default class SimObject extends EventEmitter {

  constructor() {
    super()
    this.parent = null
  }

  contact(simObject) {
    
  }

  separate(simObject) {
    
  }

  update(dt) {
    
  }

  destroy() {
    this.emit("destroy")
  }
}