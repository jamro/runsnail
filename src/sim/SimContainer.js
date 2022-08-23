export default class SimContainer {
  constructor() {
    this.children = [];
    this.parent = null
  }

  addChild(child) {
    this.children.push(child)
    child.parent = this
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child)
    child.parent = null
  }

  update() {
    this.children.forEach(child => child.update())
  }

  destroy() {
    this.children.forEach(child => child.destroy())
    if(this.parent) {
      this.parent.removeChild(this)
    }
  }
}