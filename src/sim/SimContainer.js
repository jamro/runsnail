import { EventEmitter } from 'events'

export default class SimContainer extends EventEmitter {
  constructor () {
    super()
    this.children = []
    this.parent = null
  }

  addChild (child) {
    this.children.push(child)
    child.parent = this
  }

  removeChild (child) {
    this.children = this.children.filter(c => c !== child)
    child.parent = null
  }

  update (dt) {
    this.children.forEach(child => child.update(dt))
  }

  destroy () {
    this.children.forEach(child => child.destroy())
    if (this.parent) {
      this.parent.removeChild(this)
    }
    this.emit('destroy')
  }
}
