import { Sprite } from "pixi.js";

export default class SimContainer {
  constructor() {
    this.children = [];
    this.parent = null
    this.view = new Sprite()
  }

  addChild(child) {
    this.children.push(child)
    child.parent = this
    if(child.view) {
      this.view.addChild(child.view)
    }
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child)
    child.parent = null
    if(child.view) {
      this.view.removeChild(child.view)
    }
  }

  update(dt) {
    this.children.forEach(child => child.update(dt))
  }

  render() {
    this.children.forEach(child => child.render())
  }

  destroy() {
    this.children.forEach(child => child.destroy())
    if(this.parent) {
      this.parent.removeChild(this)
    }
    if(this.view.parent) {
      this.view.parent.removeChild(this.view)
    }
  }
}