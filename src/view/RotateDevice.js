import { Loader, Sprite } from 'pixi.js'

export default class RotateDevice extends Sprite {
  constructor () {
    super()
    this.icon = Sprite.from(Loader.shared.resources.rotate.texture)
    this.icon.anchor.set(0.5)
    this.icon.scale.set(0.5)
    this.addChild(this.icon)
    this.t = 0
  }

  render (renderer) {
    super.render(renderer)
    this.t++
    if (this.t < 20) {
      return
    }

    this.icon.rotation = Math.min(this.icon.rotation + 0.05, Math.PI / 2)

    if (this.t > 100) {
      this.t = 0
      this.icon.rotation = 0
    }
  }
}
