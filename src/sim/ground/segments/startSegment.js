import * as plank from 'planck';
import Coin from '../Coin';
import GroundEdge from "../GroundEdge"

const Vec2 = plank.Vec2;

function sinFunc1(x, width, amplitude) {
  return amplitude*(Math.cos((x/width)*Math.PI*20) - 1)
}

function sinFunc2(x, width, amplitude) {
  return amplitude*(Math.cos((x/width)*Math.PI*10) - 1)
}

export default function startSegment(world, segment) {
  let stepSize = 0.25
  const width = segment.end.x - segment.start.x
  const height = segment.end.y - segment.start.y
  const stepCount = Math.round(width / stepSize)
  const stepX = width / stepCount
  const stepY = height / stepCount
  const amplitude = width/118

  let edge
  for(let i=1; i <= stepCount; i++) {
    if(i < stepCount * 0.4) {
      edge = new GroundEdge(
        world, 
        Vec2(segment.start.x + (i - 1)*stepX, segment.start.y + sinFunc1((i - 1)*stepSize , width, amplitude) + (i-1)*stepY),
        Vec2(segment.start.x + i*stepX, segment.start.y + sinFunc1(i*stepSize, width, amplitude) + i*stepY)
      )
      segment.addEdge(edge)
    } else {
      edge = new GroundEdge(
        world, 
        Vec2(segment.start.x + (i - 1)*stepX, segment.start.y + sinFunc2((i - 1)*stepSize , width, 2*amplitude) + (i-1)*stepY),
        Vec2(segment.start.x + i*stepX, segment.start.y + sinFunc2(i*stepSize, width, 2*amplitude) + i*stepY)
      )
      segment.addEdge(edge)
    }
  }

}