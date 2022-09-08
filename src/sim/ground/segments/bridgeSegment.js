import GroundEdge from '../GroundEdge'
import * as plank from 'planck'
import Stick from '../Stick'
import Coin from '../Coin'

const Vec2 = plank.Vec2

export default function bridgeSegment (world, segment) {
  const width = segment.end.x - segment.start.x
  const height = width * 0.1
  const step = 0.5
  const slope = 0.3
  let edge
  for (let x = step; x < width; x += step) {
    if (x < width * slope) {
      edge = new GroundEdge(
        world,
        Vec2(
          segment.start.x + x - step,
          segment.start.y + height * (Math.cos((Math.PI * (x - step)) / (width * slope)) - 1)
        ),
        Vec2(
          segment.start.x + x,
          segment.start.y + height * (Math.cos((Math.PI * x) / (width * slope)) - 1)
        )
      )
      segment.addEdge(edge)
    } else if (x > width * (1 - slope)) {
      edge = new GroundEdge(
        world,
        Vec2(
          segment.start.x + x - step,
          segment.start.y - 0.5 * height * (Math.cos((Math.PI * (x - step - 5)) / (width * slope)) + 1) - height
        ),
        Vec2(
          segment.start.x + x,
          segment.start.y - 0.5 * height * (Math.cos((Math.PI * (x - 5)) / (width * slope)) + 1) - height
        )
      )
      segment.addEdge(edge)
    } else {
      x = width * (1 - slope)
      edge = new GroundEdge(
        world,
        edge.end,
        Vec2(
          segment.start.x + x,
          edge.end.y
        )
      )
      segment.addEdge(edge)
    }
  }

  edge = new GroundEdge(
    world,
    edge.end,
    segment.end
  )
  segment.addEdge(edge)

  const bridgeStep = 4
  const bridgeOffset = 0.5

  for (let i = 0; i < 6; i++) {
    segment.addStick(new Stick(
      world,
      1,
      segment.start.x + width * slope + bridgeStep * i - bridgeOffset,
      segment.start.y - 2 * height + 0.5,
      0
    ))
    segment.addStick(new Stick(
      world,
      1,
      segment.start.x + width * slope + 1 + bridgeStep * i - bridgeOffset,
      segment.start.y - 2 * height + 0.5,
      0
    ))
    segment.addCoin(new Coin(
      world,
      segment.start.x + width * slope + bridgeStep * i - bridgeOffset + 0.5,
      segment.start.y - 2 * height + 0.5
    ))
    segment.addStick(new Stick(
      world,
      2.5,
      segment.start.x + width * slope + 0.5 + bridgeStep * i - bridgeOffset,
      segment.start.y - 2 * height + 1.05,
      Math.PI / 2
    ))

    segment.addStick(new Stick(
      world,
      1,
      segment.start.x + width * slope + bridgeStep * i - 0.5 - bridgeOffset,
      segment.start.y - 2 * height + 1.6,
      0
    ))
    segment.addStick(new Stick(
      world,
      1,
      segment.start.x + width * slope + 0.5 + bridgeStep * i - bridgeOffset,
      segment.start.y - 2 * height + 1.6,
      0
    ))
    segment.addStick(new Stick(
      world,
      1,
      segment.start.x + width * slope + 1 + bridgeStep * i + 0.5 - bridgeOffset,
      segment.start.y - 2 * height + 1.6,
      0
    ))

    segment.addStick(new Stick(
      world,
      1.8,
      segment.start.x + width * slope + bridgeStep * i - 0.5 - bridgeOffset + 0.1,
      segment.start.y - 2 * height + 2.15,
      Math.PI / 2
    ))
    segment.addStick(new Stick(
      world,
      1.8,
      segment.start.x + width * slope + bridgeStep * i + 1.5 - bridgeOffset - 0.1,
      segment.start.y - 2 * height + 2.15,
      Math.PI / 2
    ))
  }

  for (let j = width * slope * 0.75; j < width * (1 - slope * 0.75); j += 1) {
    segment.addCoin(new Coin(world, segment.start.x + j, segment.start.y - 2 * height + 3))
    segment.addCoin(new Coin(world, segment.start.x + j, segment.start.y - 2 * height + 4))
    segment.addCoin(new Coin(world, segment.start.x + j, segment.start.y - 2 * height + 5))
  }
}
