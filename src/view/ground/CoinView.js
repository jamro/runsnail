import { Sprite } from "pixi.js";
import View from "../View";
import {Howl, Howler} from 'howler';



export default class CoinView extends View {

  constructor(model) {
    super(model)

    this.view = Sprite.from('coin.png')
    this.view.scale.set(0.005, -0.005)
    this.view.anchor.set(0.5, 0.5);
    this.addChild(this.view)
    this.update()

    this.model.on('collect', () => {
      const collectSound = new Howl({
        src: [`sfx/coin.mp3`],
        volume: 0.1,
      })
      collectSound.play()
    })
  }

  update() {
    this.x = this.model.body.getPosition().x
    this.y = this.model.body.getPosition().y
  }
}