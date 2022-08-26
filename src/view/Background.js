import { Graphics, Sprite } from "pixi.js";

export default class Background extends Sprite {
  
  constructor() {
    super()
    this.bgWidth = 0;
    this.bgHeight = 0;

    this.staticLayer = new Graphics()
    this.addChild(this.staticLayer)

  }

  follow(centerX, centerY, width, height) {
    this.bgWidth = width;
    this.bgHeight = height;

    this.staticLayer.clear()
    
    this.staticLayer.beginFill(0xbbbbdd)
    this.staticLayer.drawRect(0, 0, this.bgWidth, this.bgHeight)

    this.staticLayer.beginFill(0x666699)
    this.staticLayer.moveTo(0, this.bgHeight)
    let x
    for(x=0; x <= this.bgWidth + 10; x+=10) {
      this.staticLayer.lineTo(
        x, 
        this.bgHeight/2 + 100 * Math.sin((x + 3 *  centerX)/100) + 30 * Math.cos((x + 3 * centerX)/290) +  1.2 * centerY
      )
    }
    this.staticLayer.lineTo(this.bgWidth, this.bgHeight + 1000)
    this.staticLayer.lineTo(0, this.bgHeight + 1000)

    this.staticLayer.beginFill(0x444466)
    this.staticLayer.moveTo(0, this.bgHeight)
    for(x=0; x <= this.bgWidth + 10; x+=10) {
      this.staticLayer.lineTo(
        x, 
        this.bgHeight/2 + 200 + 60 * Math.sin((x + 4 *  centerX)/170) + 40  * Math.cos((x + 4 *  centerX)/170) + 0.5 * centerY
      )
    }
    this.staticLayer.lineTo(this.bgWidth, this.bgHeight + 1000)
    this.staticLayer.lineTo(0, this.bgHeight + 1000)

    this.staticLayer.beginFill(0xffffff, 0.25)
    const cloudStep = 280;
    for(x = ((x - centerX) % cloudStep) - width/2; x <= 2 * this.bgWidth ; x += cloudStep) {
      this.staticLayer.drawRoundedRect(
        x, 
        50 - (10 + 0.5*centerY) * Math.sin((x+centerX)/20) - 20 * Math.cos((x+centerX)), 
        300 + 150 * Math.cos((x+centerX)/1.2),
        80, 
        40
      )
    }
     

    

  }

}