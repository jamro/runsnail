import { Sprite, Text } from "pixi.js";

export default class SleepAnim extends Sprite {

  constructor() {
    super()
    this.label = new Text(`z`, {
      fontFamily : 'Arial', 
      fontSize: 60, 
      fill : 0x000000,
      align : 'center'
    });
    this.label.scale.set(0.007, -0.007)
    this.label.anchor.set(0.5, 0.5)
    this.addChild(this.label)

    this.y = 0.25

    const a = 2*Math.random()
    const b = 0.5 + 2*Math.random()

    const loop = setInterval(() => {
      this.y += 0.05
      this.x = -b*Math.sin(this.y*a) + this.y*0.5
      if(this.y > 1.5) {
        this.parent.removeChild(this)
        clearInterval(loop)
      }
    }, 30)
  }
}