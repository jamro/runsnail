import { Sprite } from "pixi.js";
import View from "../View";

export default class CoinView extends View {

  constructor(model) {
    super(model)

    this.view = Sprite.from('coin.png')
    this.view.scale.set(0.005, -0.005)
    this.view.anchor.set(0.5, 0.5);
    this.addChild(this.view)
    this.update()
  }

  update() {
    this.x = this.model.body.getPosition().x
    this.y = this.model.body.getPosition().y
  }
}