import { Graphics, Sprite, Text } from "pixi.js"
import mobileCheck from "../mobileCheck"
import __, { ANYWHERE_TO_CONTINUE, CLICK, TAP } from "./lang"

export default class SplashScreen extends Sprite {

  constructor() {
    super()
    this.bg = new Graphics()
    this.addChild(this.bg)
    this.logo = Sprite.from('logo.png')
    this.logo.anchor.set(0.5, 0.93)
    this.addChild(this.logo)

    const action =  __(mobileCheck() ? TAP : CLICK)
    this.label = new Text(`${action.toUpperCase()} ${__(ANYWHERE_TO_CONTINUE)}`, {
      fontFamily : 'Arial', 
      fontSize: 20, 
      fill : 0xffffff,
      fontWeight: 'bold',
      align : 'center'
    });
    this.label.anchor.set(0.5, 0.5)
    this.addChild(this.label)
  }

  update(width, height) {
    this.bg.clear()
    this.bg.beginFill(0xddddff)
    this.bg.drawRect(0, 0, width, height*0.7)
    this.bg.beginFill(0x000000)
    this.bg.drawRect(0, height*0.7, width, height*0.3)
    this.logo.x = width/2
    this.logo.y = height*0.7
    this.logo.scale.set(Math.min(
      1, 
      width/(this.logo.width/this.logo.scale.x),
      (0.7*height)/(this.logo.height/this.logo.scale.y),
    ))
    this.label.x = width/2
    this.label.y = height*0.85
  }

}