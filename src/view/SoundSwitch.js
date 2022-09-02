import { Graphics, Loader, Sprite } from "pixi.js";

export default class SoundSwitch extends Sprite {

  constructor() {
    super()
    this.container = new Sprite()
    this.container.interactive = true
    this.addChild(this.container)
    this.bg = new Graphics()
    this.bg.beginFill(0xffffff, 0.000001)
    this.bg.drawCircle(0, 0, 50)
    this.container.addChild(this.bg)
    this.button = Sprite.from(Loader.shared.resources.sound.texture)
    this.button.anchor.set(0.5, 0.5)
    this.button.scale.set(0.6)
    this.container.addChild(this.button)

    this._buttonMask = new Graphics()
    this._buttonMask.beginFill(0x000000)
    this._buttonMask.drawRect(-30, -25, 32, 50)

    this.addChild(this._buttonMask)
    this._buttonMask.visible = false

    this._on = true
    this.on = true

    this.container.on('pointerdown', (e) => {
      e.stopPropagation()
      this.on = !this.on
    })
    this.container.on('pointerup', (e) => {
      e.stopPropagation()
    })
  }

  get on() {
    return this._on
  }

  set on(value) {
    this._on = value
    this._buttonMask.visible = !value
    this.button.mask = value ? null : this._buttonMask
    Howler.mute(!value)
  }



}