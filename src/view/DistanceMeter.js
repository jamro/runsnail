import { Loader, Sprite, Text } from "pixi.js";
import __, { BEST } from "./lang.js"
export default class DistanceMeter extends Sprite {

  constructor() {
    super()
    this.bg = Sprite.from(Loader.shared.resources.distanceMeter.texture)
    this.bg.scale.set(0.75)
    this.addChild(this.bg)

    this.label = new Text('0.0m', {
      fontFamily : 'Arial', 
      fontSize: 20, 
      fill : 0xffffff
    });
    this.label.x = 210
    this.label.y = 18
    this.label.anchor.set(1, 0)
    this.addChild(this.label)
    this._value = 0

    this.best = new Text('Best: 1000.0m', {
      fontFamily : 'Arial', 
      fontSize: 15, 
      fill : 0x000000,
      align : 'right'
    });
    this.best.x = 210
    this.best.y = 47
    this.best.anchor.set(1, 0)
    this.best.visible = false
    this.addChild(this.best)
    this._bestResult = 0

    if(localStorage) {
      this.bestResult = Number(localStorage.getItem('bestResult')) || 0
    }
  }

  set bestResult(value) {
    this._bestResult = value
    this.best.text = `${__(BEST)}: ${value.toFixed(1)}m`
    this.best.visible = value > 0
  }

  get bestResult() {
    return this._bestResult
  }

  set value(value) {
    this._value = value
    this.label.text = value.toFixed(1) + 'm'
  }

  get value() {
    return this._value
  }

}