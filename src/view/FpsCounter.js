import { Sprite, Text } from 'pixi.js'

export default class FpsCounter extends Sprite {
  constructor () {
    super()
    this.label = new Text('FPS: ???', {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 0x000000
    })
    this.addChild(this.label)
    this.label.x = 30
    this.label.y = 60
    this.counter = 0
    this.flushTime = 0
    this.info = ''
  }

  tick () {
    const now = new Date().getTime()
    const dt = (now - this.flushTime) / 1000
    if (dt > 1) {
      this.flushTime = now
      this.label.text = `FPS: ${(this.counter / dt).toFixed(1)} ${this.info}`
      this.counter = 0
    }

    this.counter++
  }
}
