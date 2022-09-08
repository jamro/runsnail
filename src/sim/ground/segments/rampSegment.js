import GroundEdge from '../GroundEdge'
import * as plank from 'planck'
import Coin from '../Coin'

const Vec2 = plank.Vec2

function sinFunc (x, width, amplitude) {
  return amplitude * (Math.cos((x / width) * Math.PI * 2) - 1)
}

export default function rampSegment (world, segment) {
  const stepSize = 0.5
  const width = segment.end.x - segment.start.x
  const height = segment.end.y - segment.start.y
  let stepCount = Math.round(width / stepSize)
  stepCount = Math.round(stepCount / 4) * 4
  const stepX = width / stepCount
  const stepY = height / stepCount

  const amplitude = width / 8
  let edge
  let coin
  for (let i = 1; i < stepCount; i++) {
    if (i < 0.75 * stepCount) {
      edge = new GroundEdge(
        world,
        Vec2(segment.start.x + (i - 1) * stepX, segment.start.y + sinFunc((i - 1) * stepSize, 1.5 * width, amplitude) + (i - 1) * stepY),
        Vec2(segment.start.x + i * stepX, segment.start.y + sinFunc(i * stepSize, 1.5 * width, amplitude) + i * stepY)
      )
    } else {
      edge = new GroundEdge(
        world,
        edge.end,
        Vec2(segment.start.x + i * stepX, segment.start.y + sinFunc(i * stepSize, 0.5 * width, amplitude) + i * stepY)
      )

      if (segment.data.coins && i > stepCount * 0.5 && i < stepCount * 0.9 && i % 3 === 0) {
        coin = new Coin(world, edge.start.x, edge.start.y + 0.8)
        segment.addCoin(coin)
      }
    }
    segment.addEdge(edge)
  }

  edge = new GroundEdge(
    world,
    edge.end,
    Vec2(segment.end.x, segment.end.y)
  )
  segment.addEdge(edge)
}
