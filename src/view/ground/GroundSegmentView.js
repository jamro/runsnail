import GroundEdgeView from "./GroundEdgeView";
import View from "../View";
import CoinView from "./CoinView";
import StickView from "./StickView";

export default class GroundSegmentView extends View {

  constructor(model) {
    super(model)

    this.edges = []
    this.coins = []
    this.sticks = []

    model.edges.forEach(edge => this.addElement(edge, GroundEdgeView, this.edges))
    model.coins.forEach(coin => this.addElement(coin, CoinView, this.coins))
    model.sticks.forEach(stick => this.addElement(stick, StickView, this.sticks))

    this.model.on('addEdge', edge => this.addElement(edge, GroundEdgeView, this.edges))
    this.model.on('removeEdge', edge => this.removeElement(edge, this.edges))
    this.model.on('addCoin', coin => this.addElement(coin, CoinView, this.coins))
    this.model.on('removeCoin', coin => this.removeElement(coin, this.coins))
    this.model.on('addStick', stick => this.addElement(stick, StickView, this.sticks))
    this.model.on('removeStick', stick => this.removeElement(stick, this.sticks))
  }

  addElement(element, ViewDef, elementList) {
    const view = new ViewDef(element)
    elementList.push({
      model: element,
      view
    })
    this.addChild(view)
  }

  removeElement(element, elementList) {
    const index = elementList.findIndex(e => e.model === element)
    if(index !== -1) {
      this.removeChild(elementList[index].view)
      elementList.splice(index, 1)
    }
  }

  update() {
    this.edges.forEach(edge => edge.view.update())
    this.coins.forEach(coin => coin.view.update())
    this.sticks.forEach(stick => stick.view.update())
  }

}