import { Body, Composite } from "matter-js";
import { Container } from "pixi.js";
import GameObject from "./GameObject.js";

export default class GameContainer extends GameObject {

  constructor(props = {}) {
    super()
    this.children = []
    this.container = new Container()
    this.body = Composite.create()
  }

  addChild(obj) {
    this.children.push(obj)
    if(obj.graphicContainer) {
      this.container.addChild(obj.graphicContainer)
    }
    if(obj.physicBody) {
      Composite.addBody(this.body, obj.physicBody)
    }
  }

  removeChild(obj) {
    this.children = this.children.filter(child => child !== obj)
    if(obj.graphicContainer) {
      this.container.removeChild(obj.graphicContainer)
    }
    if(obj.physicBody) {
      Composite.removeBody(this.body, obj.physicBody)
    } 
  }

  update() {
    this.children.forEach((child) => {
      child.update()
    })
  }

  render() {
    this.children.forEach((child) => {
      child.render()
    })
  }

}