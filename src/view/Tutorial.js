import { Sprite, Text } from "pixi.js"
import {DropShadowFilter} from '@pixi/filter-drop-shadow';

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
      fontSize: 40, 
      fill : 0xffffff,
    });
    this.addChild(this.label)
    this.label.y = 140
    this.label.x = 20

    this._page = 1

    this.page = 2
  }

  set page(page) {
    this._page = page
    this.page1.visible = page == 1
    this.page2.visible = page == 2
    this.label.text = page == 1 ? `Hold = Dive` : `Release = Fly up`
  }

  get page() {
    return this._page
  }


}