import { Graphics } from 'pixi.js'
import View from '../View'

export default class GroundEdgeView extends View {
  constructor (model) {
    super(model)

    this.view = new Graphics()
    this.view.beginFill(0x000000)
    this.view.lineTo(this.model.start.x, this.model.start.y)
    this.view.lineTo(this.model.end.x, this.model.end.y)
    this.view.lineTo(this.model.end.x, this.model.end.y - 1000)
    this.view.lineTo(this.model.start.x, this.model.start.y - 1000)
    this.view.lineTo(this.model.start.x, this.model.start.y)
    this.addChild(this.view)
  }
}
