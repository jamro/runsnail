import { Graphics, Sprite } from "pixi.js";

export default class Background extends Sprite {
  
  constructor() {
    super()
    this.bgWidth = 0;
    this.bgHeight = 0;

    this.staticLayer = new Graphics()
    this.addChild(this.staticLayer)

  }

  follow(x, y, width, height) {
    if(this.bgWidth !== width || this.bgHeight !== height) {
      this.bgWidth = width;
      this.bgHeight = height;
      
      this.staticLayer.beginFill(0xbbbbdd)
      this.staticLayer.drawRect(0, 0, this.bgWidth, this.bgHeight)

      this.staticLayer.beginFill(0x666699)
      this.staticLayer.moveTo(0, this.bgHeight)
      for(let x=0; x <= this.bgWidth + 10; x+=10) {
        this.staticLayer.lineTo(x, this.bgHeight/2 + 50 * Math.sin(x/100))
      }
      this.staticLayer.lineTo(this.bgWidth, this.bgHeight)

      this.staticLayer.beginFill(0x444466)
      this.staticLayer.moveTo(0, this.bgHeight)
      for(let x=0; x <= this.bgWidth + 10; x+=10) {
        this.staticLayer.lineTo(x, this.bgHeight/2 + 200 + 60 * Math.sin(x/170))
      }
      this.staticLayer.lineTo(this.bgWidth, this.bgHeight)

      this.staticLayer.beginFill(0xffffff, 0.5)
      this.staticLayer.drawRoundedRect(50, 50, 300, 80, 40)
      this.staticLayer.drawRoundedRect(250, 90, 400, 80, 40)
      this.staticLayer.drawRoundedRect(800, 70, 250, 80, 40)
      this.staticLayer.drawRoundedRect(1200, 60, 340, 80, 40)
      this.staticLayer.drawRoundedRect(1300, 100, 150, 80, 40)

    }
  }

}