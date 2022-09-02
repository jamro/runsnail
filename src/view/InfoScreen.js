import { Graphics, Loader, Sprite, Text } from "pixi.js";
import mobileCheck from "../mobileCheck";
import __, { ANYWHERE_TO_CONTINUE, CLICK, HOLD, HOLD_CLICK_TUTORIAL, HOLD_TAP_TUTORIAL, RELEASE, RELEASE_CLICK_TUTORIAL, RELEASE_TAP_TUTORIAL, TAP } from "./lang"
const CONTENT_WIDTH = 950
const CONTENT_HEIGHT = 450

export default class InfoScreen extends Sprite {
  constructor() {
    super()
    this.bg = new Graphics()
    this.content = new Sprite()

    let element;
    element = Sprite.from(Loader.shared.resources.tutorial_hold.texture)
    element.x = -400
    element.y = -150
    this.content.addChild(element)
    element = Sprite.from(Loader.shared.resources.tutorial_dive.texture)
    element.x = -300
    element.y = -150
    this.content.addChild(element)
    element = new Text(__(HOLD).toUpperCase(), {
      fontFamily : 'Arial', 
      fontSize: 25, 
      align : 'center',
      fill : 0xffffff,
    });
    element.anchor.set(0.5)
    element.y = 20
    element.x = -250
    this.content.addChild(element)
    element = new Text(__(mobileCheck() ? HOLD_TAP_TUTORIAL : HOLD_CLICK_TUTORIAL), {
      fontFamily : 'Arial', 
      fontSize: 18, 
      align : 'center',
      fill : 0xffffff,
    });
    element.anchor.set(0.5, 0.5)
    element.y = 85
    element.x = -250
    this.content.addChild(element)

    element = Sprite.from(Loader.shared.resources.tutorial_release.texture)
    element.x = 100
    element.y = -150
    this.content.addChild(element)
    element = Sprite.from(Loader.shared.resources.tutorial_flyup.texture)
    element.x = 200
    element.y = -150
    this.content.addChild(element)
    element = new Graphics()
    element.lineStyle(3, 0xffffff)
    element.moveTo(0, -150)
    element.lineTo(0, 150)
    this.content.addChild(element)
    element = new Text(__(RELEASE).toUpperCase(), {
      fontFamily : 'Arial', 
      fontSize: 25, 
      align : 'center',
      fill : 0xffffff,
    });
    element.anchor.set(0.5, 0.5)
    element.y = 20
    element.x = 250
    this.content.addChild(element)
    element = new Text(__(mobileCheck() ? RELEASE_TAP_TUTORIAL : RELEASE_CLICK_TUTORIAL), {
      fontFamily : 'Arial', 
      fontSize: 18, 
      align : 'center',
      fill : 0xffffff,
    });
    element.anchor.set(0.5, 0.5)
    element.y = 85
    element.x = 250
    this.content.addChild(element)

    element = new Text(`${__(mobileCheck() ? TAP : CLICK)} ${__(ANYWHERE_TO_CONTINUE)}`, {
      fontFamily : 'Arial', 
      fontSize: 18, 
      align : 'center',
      fill : 0xffffff,
    });
    element.anchor.set(0.5, 0.5)
    element.y = 180
    element.x = 0
    this.content.addChild(element)

    this.content.anchor.set(0.5, 0.5)

    this.addChild(this.bg)
    this.addChild(this.content)
  }

  resize(width, height) {
    this.bg.clear()
    this.bg.beginFill(0x666699, 0.9)
    this.bg.lineStyle(3, 0xffffff, 1)
    this.bg.drawRoundedRect(width*0.1, height*0.1, width*0.8, height*0.8, Math.min(width, height)*0.05)
    this.content.x = width*0.1 + width*0.8*0.5
    this.content.y = height*0.1 + height*0.8*0.5
    this.content.scale.set(Math.min((width*0.8)/CONTENT_WIDTH, (height*0.8)/CONTENT_HEIGHT))
  }
}