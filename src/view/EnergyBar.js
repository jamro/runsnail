import { Graphics, Sprite } from "pixi.js";

export default class EnergyBar extends Sprite {
  constructor() {
    super()
    this.bg = new Graphics()
    this.bg.beginFill(0x000000)
    this.bg.drawRect(49, 6, 144, 23)
    this.bg.endFill()
    this.addChild(this.bg)

    this.progress = new Graphics()
    this.progress.beginFill(0xffff00)
    this.progress.drawRect(0, 6, 144, 23)
    this.progress.endFill()
    this.progress.beginFill(0xffffff)
    this.progress.drawRect(0, 6, 144, 5)
    this.progress.endFill()
    this.progress.beginFill(0xffaa00)
    this.progress.drawRect(0, 26, 144, 3)
    this.progress.endFill()
    this.progress.x = 49
    this.addChild(this.progress)

    this.face = Sprite.from('energy.png')
    this.addChild(this.face)

    this._value = 1
  }

  set value(value) {
    this._value = value
    this.progress.scale.x = value
  }

  get value() {
    return this._value
  }
}