import View from '../View'
import CoinView from './CoinView'
import StickView from './StickView'
import { Graphics } from 'pixi.js'

export default class GroundSegmentView extends View {
  constructor (model) {
    super(model)

    this.coins = []
    this.sticks = []

    this.lastEdge = null
    this.edge = new Graphics()
    this.edge.beginFill(0x000000)
    this.addChild(this.edge)

    model.edges.forEach(edge => this.addEdge(edge))
    this.edge.lineTo(this.lastEdge.end.x, this.lastEdge.end.y - 100)
    model.coins.forEach(coin => this.addElement(coin, CoinView, this.coins))
    model.sticks.forEach(stick => this.addElement(stick, StickView, this.sticks))

    this.model.on('addCoin', coin => this.addElement(coin, CoinView, this.coins))
    this.model.on('removeCoin', coin => this.removeElement(coin, this.coins))
    this.model.on('addStick', stick => this.addElement(stick, StickView, this.sticks))
    this.model.on('removeStick', stick => this.removeElement(stick, this.sticks))
  }

  addEdge (element) {
    if (!this.lastEdge) {
      this.edge.moveTo(element.start.x, element.start.y - 100)
      this.edge.lineTo(element.start.x, element.start.y)
    }
    this.edge.lineTo(element.end.x, element.end.y)
    this.lastEdge = element
  }

  addElement (element, ViewDef, elementList) {
    const view = new ViewDef(element)
    elementList.push({
      model: element,
      view
    })
    this.addChild(view)
  }

  removeElement (element, elementList) {
    const index = elementList.findIndex(e => e.model === element)
    if (index !== -1) {
      this.removeChild(elementList[index].view)
      elementList.splice(index, 1)
    }
  }

  update () {
    this.coins.forEach(coin => coin.view.update())
    this.sticks.forEach(stick => stick.view.update())
  }
}
