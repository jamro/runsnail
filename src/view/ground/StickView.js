import { Graphics } from "pixi.js";
import View from "../View";
import {Howl, Howler} from 'howler';
import WorldView from "../WorldView";

export default class StickView extends View {

  constructor(model) {
    super(model)

    this.view = this.drawStick(this.model.length)
    this.view.cacheAsBitmap = true
    this.view.cacheAsBitmapResolution = 100
    this.addChild(this.view)
    this.update()

    model.on('crack', () => {
      const crackSound = new Howl({
        src: [`sfx/crack.mp3`],
        volume: 0.5,
        sprite: {
          crack1: [130, 210],
          crack2: [600, 300],
          crack3: [1000, 600],
          crack4: [1500, 800],
          crack5: [1800, 1000],
          crack6: [3100, 400],
        }
      })
      

      let pointer = this
      let absoluteX  = 0;

      while(pointer && pointer.constructor !== WorldView) {
        absoluteX = (absoluteX * pointer.scale.x + pointer.x)
        pointer = pointer.parent
      }
      if(pointer && absoluteX> 0) {
        crackSound.play('crack' + Math.floor(Math.random()*6+1))
      }
      
    })
  }

  drawStick(length) {
    const graphics = new Graphics()
    graphics.beginFill(0x000000)
    const topWidth = 0.048 + Math.random()*0.04
    const bottomWidth = 0.048 + Math.random()*0.04
    const shifts = Array(Math.floor(Math.random()*3)).fill(0).map(() => 0.08*Math.random()-0.04)
    const segmentLength = length / (shifts.length + 1)
    let i

    graphics.moveTo(-topWidth, -length/2)
    graphics.lineTo(topWidth, -length/2)
    for(i = 0; i < shifts.length; i++) {
      graphics.lineTo(0.05 + shifts[i], -length/2 + (i+1) * segmentLength)
    }
    graphics.lineTo(bottomWidth, length/2)
    graphics.lineTo(-bottomWidth, length/2)
    for(i = shifts.length-1; i >= 0; i--) {
      graphics.lineTo(-0.05 + shifts[i], -length/2 + (i+1) * segmentLength)
    }
    graphics.moveTo(-topWidth, -length/2)

    if(Math.random() > 0.8) {
      graphics.moveTo(0, -0.03+0.05)
      graphics.lineTo(0.15, -0.15+0.05)
      graphics.lineTo(0.15, -0.11+0.05)
      graphics.lineTo(0, 0.03+0.05)
    }

    if(Math.random() > 0.8) {
      graphics.moveTo(0, -0.03-0.05)
      graphics.lineTo(-0.15, -0.15-0.05)
      graphics.lineTo(-0.15, -0.11-0.05)
      graphics.lineTo(0, 0.03-0.05)
    }
    return graphics
  }

  update() {
    this.x = this.model.body.getPosition().x
    this.y = this.model.body.getPosition().y
    this.rotation = this.model.body.getAngle()
  }
}