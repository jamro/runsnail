import { Graphics, Sprite, Text } from "pixi.js";
import mobileCheck from "../mobileCheck";
import __, { CLICK, TAP, TO_REPLAY } from "./lang";

export default class Cloud extends Sprite {

  constructor(model) {
    super(model)
    this.content = Sprite.from('replay.png')
    this.content.y = -350
    this.content.anchor.set(0.5)
    this.addChild(this.content)

    const action =  __(mobileCheck() ? TAP : CLICK)

    this.label = new Text(`${action.toUpperCase()} ${__(TO_REPLAY)}`, {
      fontFamily : 'Arial', 
      fontSize: 50, 
      fill : 0x000000,
      fontWeight: 'bold',
      align : 'center'
    });
    this.label.x = 20
    this.label.y = -310
    this.label.anchor.set(0.5, 0.5)
    this.addChild(this.label)
  }

}