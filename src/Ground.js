import GroundEdge from './GroundEdge.js';
import getGroundShape from './getGroundShape.js'
import Coin from './Coin.js';
import getCoinPlacement from './getCoinPlacement.js';

const SEGMENT_WIDTH = 1;

export default class Ground {

  constructor(world) {
    this.world = world;
    this.edges = [];
    this.coins = [];
  }

  build(x, width) {
    let edge
    let coin
    if(this.edges.length === 0) {
      this.edges.push(new GroundEdge(
        this.world, 
        getGroundShape(x - SEGMENT_WIDTH/2), 
        getGroundShape(x + SEGMENT_WIDTH/2)
      ))
    }

    while(this.edges[0].start.x > x - width/2) {
      this.edges.unshift(new GroundEdge(
        this.world, 
        getGroundShape(this.edges[0].start.x - SEGMENT_WIDTH),
        getGroundShape(this.edges[0].start.x)
      ))
    }

    while(this.edges[this.edges.length-1].end.x < x + width/2) {
      this.edges.push(new GroundEdge(
        this.world, 
        getGroundShape(this.edges[this.edges.length-1].end.x),
        getGroundShape(this.edges[this.edges.length-1].end.x + SEGMENT_WIDTH)
      ))
      if(getCoinPlacement(this.edges[this.edges.length-1].end.x)) {
        this.coins.push(new Coin(
          this.world, 
          this.edges[this.edges.length-1].end.x,
          this.edges[this.edges.length-1].end.y + 1
        )) 
      }
    }
    
    while(this.edges[0].end.x < x - width/2) {
      edge = this.edges.shift()
      this.world.destroyBody(edge.body)
    }

    while(this.edges[this.edges.length-1].start.x > x + width/2) {
      edge = this.edges.pop()
      this.world.destroyBody(edge.body)
    }

    while(this.coins.length && this.coins[0].x < x - width/2) {
      coin = this.coins.shift()
      this.world.destroyBody(coin.body)
    }
    
    this.coins.filter(c => c.collected).forEach(c => this.world.destroyBody(c.body))
    this.coins.filter(c => !c.collected)
    
  }

}