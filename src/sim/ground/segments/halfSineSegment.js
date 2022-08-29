import * as plank from 'planck';
import Coin from '../Coin';
import GroundEdge from "../GroundEdge"

const Vec2 = plank.Vec2;

function sinFunc(x, width, amplitude) {
  return -0.5*amplitude*(Math.cos((x/width)*Math.PI)-1)
}

export default function halfSineSegment(world, segment) {
  let stepSize = 1
  const width = segment.end.x - segment.start.x
  const height = segment.end.y - segment.start.y
  const stepCount = Math.round(width / stepSize)
  const stepX = width / stepCount

  let edge
  for(let i=1; i <= stepCount; i++) {
    edge = new GroundEdge(
      world, 
      Vec2(
        segment.start.x + (i - 1)*stepX, 
        segment.start.y + sinFunc((i - 1)*stepSize, width, height)
      ),
      Vec2(
        segment.start.x + i*stepX, 
        segment.start.y + sinFunc(i*stepSize, width, height)
      )
    )
    segment.addEdge(edge)
  }

}