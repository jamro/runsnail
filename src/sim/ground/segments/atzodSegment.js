import Coin from '../Coin'
import GroundEdge from '../GroundEdge'
import * as plank from 'planck'

const Vec2 = plank.Vec2

function sinFunc (x, width, amplitude) {
  return amplitude * (Math.cos((x / width) * Math.PI * 8) - 1)
}

function drawCoinPixels (world, segment, x, y, shape) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] !== ' ') {
        segment.addCoin(new Coin(world, x + j * 0.8, y - i * 0.8))
      }
    }
  }
}

export default function atzodSegment (world, segment) {
  const stepSize = 1
  const width = segment.end.x - segment.start.x
  const height = segment.end.y - segment.start.y
  const stepCount = Math.round(width / stepSize)
  const stepX = width / stepCount
  const stepY = height / stepCount

  const amplitude = width / 30

  let edge
  for (let i = 1; i <= stepCount; i++) {
    edge = new GroundEdge(
      world,
      Vec2(segment.start.x + (i - 1) * stepX, segment.start.y + sinFunc((i - 1) * stepSize, width, amplitude) + (i - 1) * stepY),
      Vec2(segment.start.x + i * stepX, segment.start.y + sinFunc(i * stepSize, width, amplitude) + i * stepY)
    )
    segment.addEdge(edge)
  }

  drawCoinPixels(
    world,
    segment,
    segment.start.x + 14,
    segment.start.y + 5,
    [
      ' XXXX                                          ',
      'XX   X   XXXXXXXX                              ',
      'XXXXXX      XX      XXXXXX                     ',
      'XX   X      XX         XX      XXXXX           ',
      'XX   X      XX        XX      XX    X   XXXXXX ',
      '            XX       XX       XX    X   XX    X',
      '                    XXXXXXX   XX    X   XX    X',
      '                               XXXXX    XX    X ',
      '                                        XXXXXX  '
    ]
  )
}
