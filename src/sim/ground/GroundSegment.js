import SimContainer from "../SimContainer"

export default class GroundSegment extends SimContainer {

  constructor(type, start, end, data) {
    super()
    this.type = type
    this.start = start
    this.end = end
    this.data = data
    this.edges = []
    this.coins = []
    this.sticks = []
  }

  addEdge(edge) {
    this.edges.push(edge)
    this.addChild(edge)
    edge.on('destroy', () => this.emit('removeEdge', edge))
    this.emit('addEdge', edge)
  }

  addCoin(coin) {
    this.coins.push(coin)
    this.addChild(coin)
    coin.on('destroy', () => this.emit('removeCoin', coin))
    this.emit('addCoin', coin)
  }

  addStick(stick) {
    this.sticks.push(stick)
    this.addChild(stick)
    stick.on('destroy', () => this.emit('removeStick', stick))
    this.emit('addStick', stick)
  }

}