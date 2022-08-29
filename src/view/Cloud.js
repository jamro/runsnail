import { Sprite, Text } from "pixi.js";
import mobileCheck from "../mobileCheck";
import __, { CLICK, RESULT, TAP, TO_REPLAY } from "./lang";

export default class Cloud extends Sprite {

  constructor(model) {
    super(model)
    this.content = Sprite.from('cloud.png')
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

    this.replayIcon = Sprite.from('replay.png')
    this.replayIcon.anchor.set(0.5, 0.5)
    this.replayIcon.y = - 460
    this.addChild(this.replayIcon)

    this.distanceIcon = Sprite.from('distance.png')
    this.distanceIcon.anchor.set(0.5, 0.5)
    this.distanceIcon.y = - 460
    this.addChild(this.distanceIcon)

    this.distanceIcon.visible = false
    this.replayIcon.visible = true
  }

  displayResult(distance) {
    this.distanceIcon.visible = true
    this.replayIcon.visible = false
    this.label.text = `${__(RESULT).toUpperCase()}: \n${distance.toFixed(1)}m`
  }

  displayReplayPrompt() {
    this.distanceIcon.visible = false
    this.replayIcon.visible = true
    const action =  __(mobileCheck() ? TAP : CLICK)
    this.label.text = `${action.toUpperCase()} ${__(TO_REPLAY)}`
  }

}