import { Graphics, Sprite } from 'pixi.js'

function drawStar (canvas) {
  canvas.beginFill(0x000000)
  const stepCount = 10
  const angleStep = (Math.PI * 2) / stepCount
  const radius = 4
  canvas.moveTo(0 + radius, 0)
  for (let i = 1; i <= stepCount; i++) {
    const x = (i % 2 === 0 ? radius : 0.5 * radius) * Math.cos(angleStep * i)
    const y = (i % 2 === 0 ? radius : 0.5 * radius) * Math.sin(angleStep * i)
    canvas.lineTo(x, y)
  }
}

export default class KnockoutAnim extends Sprite {
  constructor () {
    super()
    this.stars = [
      new Graphics(),
      new Graphics(),
      new Graphics(),
      new Graphics()
    ]
    this.stars.forEach(star => {
      drawStar(star)
      this.addChild(star)
    })
    this.scale.set(0.07)
    this.t = 0

    this.starScale = 1
    this._active = false
    this.visible = false
  }

  get active () {
    return this._active
  }

  set active (value) {
    this._active = value

    if (value) {
      this.visible = true
      this.starScale = Math.max(this.starScale, 0.02)
    }
  }

  render (renderer) {
    if (!this.visible) {
      return
    }
    this.t++
    super.render(renderer)

    const angleShift = (Math.PI * 2) / this.stars.length
    this.starScale += ((this._active ? 1 : 0) - this.starScale) * 0.04

    for (let i = 0; i < this.stars.length; i++) {
      const scale = Math.cos(this.t / 8 + i * angleShift) * 0.5 + 0.5
      this.stars[i].x = Math.sin(this.t / 8 + i * angleShift) * 10
      this.stars[i].y = Math.cos(this.t / 8 + i * angleShift) * 3 + 15 - 10 * scale
      this.stars[i].scale.set(scale * this.starScale)
    }

    this.visible = (this.starScale > 0.01)
  }
}
