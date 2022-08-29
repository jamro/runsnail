import { Sprite, Text } from "pixi.js"
import {DropShadowFilter} from '@pixi/filter-drop-shadow';
import __, { DIVE, FLY_UP, HOLD, RELEASE } from "./lang";

export default class Tutorial extends Sprite {
  constructor() {
    super()
    const shadow = new DropShadowFilter()
    shadow.blur = 1
    shadow.color = 0x000000
    shadow.alpha = 1
    shadow.distance = 0
    this.page1 = Sprite.from('tutorial1.png')
    this.page2 = Sprite.from('tutorial2.png')
    this.page2.x = -5
    this.page2.y = 5

    this.filters = [shadow, shadow]

    this.addChild(this.page1)
    this.addChild(this.page2)
    this.page1.visible = false
    this.page2.visible = false

    this.label = new Text(``, {
      fontFamily : 'Arial', 
      fontSize: 25, 
      fill : 0xffffff,
    });
    this.addChild(this.label)
    this.label.y = 150
    this.label.x = 160
    this.label.anchor.set(0.5, 0.5)

    this._page = 1
    this.page = 2
  }

  set page(page) {
    this._page = page
    this.page1.visible = page == 1
    this.page2.visible = page == 2
    this.label.text = page == 1 ? `${__(HOLD)} = ${__(DIVE)}` : `${__(RELEASE)} = ${__ (FLY_UP)}`
  }

  get page() {
    return this._page
  }


}