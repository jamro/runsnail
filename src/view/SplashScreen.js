import { Graphics, Sprite, Text } from "pixi.js"
import mobileCheck from "../mobileCheck"
import __, { ANYWHERE_TO_CONTINUE, CLICK, TAP } from "./lang"

export default class SplashScreen extends Sprite {

  constructor(version) {
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

    this.progressContainer = new Sprite()
    this.addChild(this.progressContainer)
    const bg = new Graphics()
    bg.beginFill(0x000000)
    bg.lineStyle(2, 0xffffff)
    bg.drawRoundedRect(-105, -5, 210, 10, 5)
    this.progressContainer.addChild(bg)
    this.progressLine = new Graphics()
    this.progressContainer.addChild(this.progressLine)

    this.status = new Text(`Loading...`, {
      fontFamily : 'Arial', 
      fontSize: 13, 
      fill : 0xffffff,
      align : 'center'
    });
    this.status.anchor.set(0.5, 0.5)
    this.status.y = 20
    this.progressContainer.addChild(this.status)
    
    this._progress = 0
    this.progress = 0

    this.versionLabel = new Text(`v${version}`, {
      fontFamily : 'Arial', 
      fontSize: 15, 
      fill : 0x000000
    });
    this.versionLabel.anchor.set(0, 0.8)
    this.addChild(this.versionLabel)
  }

  set loadingStatus(status) {
    this.status.text = status
  }

  get loadingStatus() {
    return this.status.text
  }

  set progress(value) {
    value = Math.max(0, Math.min(100, value))
    this._progress = value
    this.label.visible = (value === 100)
    this.progressContainer.visible = (value < 100)
    this.progressLine.clear()
    this.progressLine.lineStyle(4, 0xffffff)
    this.progressLine.moveTo(-100, 0)
    this.progressLine.lineTo(-100 + value*2, 0)
  }

  get progress() {
    return this._progress
  }

  update(width, height) {
    this.bg.clear()
    this.bg.beginFill(0xddddff)
    this.bg.drawRect(0, 0, width, height*0.7)
    this.bg.beginFill(0x000000)
    this.bg.drawRect(0, height*0.7, width, height*0.3)

    this.bg.beginFill(0x8888bb)
    this.bg.moveTo(0, height*0.7)
    this.bg.lineTo(0, height*0.5)

    for(let x=0; x<width+10; x+=10) {
      this.bg.lineTo(x, height*0.4 + height*0.2 * Math.sin(x/100+0.7))
    }

    this.bg.lineTo(width, height*0.5)
    this.bg.lineTo(width, height*0.7)
    this.bg.lineTo(0, height*0.7)

    this.logo.x = width/2
    this.logo.y = height*0.7
    this.logo.scale.set(Math.min(
      1, 
      width/(this.logo.width/this.logo.scale.x),
      (0.7*height)/(this.logo.height/this.logo.scale.y),
    ))
    this.label.x = width/2
    this.label.y = height*0.85

    this.versionLabel.x = width/2 + this.logo.scale.x*330
    this.versionLabel.y = height*0.7

    this.progressContainer.x = width/2
    this.progressContainer.y = height*0.85
  }

}