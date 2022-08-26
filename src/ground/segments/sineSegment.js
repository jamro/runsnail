import * as plank from 'planck/dist/planck-with-testbed';
import Coin from '../../Coin';
import GroundEdge from "../GroundEdge"

const Vec2 = plank.Vec2;

function sinFunc(x, width, amplitude) {
  return amplitude*(Math.cos((x/width)*Math.PI*2) - 1)
}

export default function sineSegment(world, segment) {
  let stepSize = 1
  const width = segment.end.x - segment.start.x
  const height = segment.end.y - segment.start.y
  const stepCount = Math.round(width / stepSize)
  const stepX = width / stepCount
  const stepY = height / stepCount

  let edge
  let coin
  for(let i=1; i <= stepCount; i++) {
    edge = new GroundEdge(
      world, 
      Vec2(segment.start.x + (i - 1)*stepX, segment.start.y + sinFunc((i - 1)*stepSize , width, segment.data.amplitude) + (i-1)*stepY),
      Vec2(segment.start.x + i*stepX, segment.start.y + sinFunc(i*stepSize, width, segment.data.amplitude) + i*stepY)
    )
    segment.addChild(edge)
    if(segment.data.coins && i > stepCount*0.2  && i < stepCount*0.5  ) {
      coin = new Coin(world, edge.start.x, edge.start.y+0.8)
      segment.addChild(coin)
    }
  }

}