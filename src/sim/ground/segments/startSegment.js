import * as plank from 'planck';
import Coin from '../Coin';
import GroundEdge from "../GroundEdge"

const Vec2 = plank.Vec2;

function sinFunc(x, width, amplitude) {
  return amplitude*(Math.cos((x/width)*Math.PI*16) - 1)
}

export default function startSegment(world, segment) {
  let stepSize = 1
  const width = segment.end.x - segment.start.x
  const height = segment.end.y - segment.start.y
  const stepCount = Math.round(width / stepSize)
  const stepX = width / stepCount
  const stepY = height / stepCount
  const amplitude = width/56

  let edge
  let coin
  for(let i=1; i <= stepCount; i++) {
    edge = new GroundEdge(
      world, 
      Vec2(segment.start.x + (i - 1)*stepX, segment.start.y + sinFunc((i - 1)*stepSize , width, amplitude) + (i-1)*stepY),
      Vec2(segment.start.x + i*stepX, segment.start.y + sinFunc(i*stepSize, width, amplitude) + i*stepY)
    )
    segment.addEdge(edge)
    if(i > stepCount*0.75 && i < stepCount*0.99) {
      coin = new Coin(world, edge.start.x, edge.start.y+0.8)
      segment.addCoin(coin)
    }
  }

}