import { Loader, Sprite, Text } from "pixi.js";

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
  }

  set value(value) {
    this._value = value
    this.label.text = value.toFixed(1) + 'm'
  }

  get value() {
    return this._value
  }

}