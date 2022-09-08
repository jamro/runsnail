import * as plank from 'planck'
import GroundEdge from './GroundEdge'

const Vec2 = plank.Vec2

export default class SineBuilder {
  constructor (world, segment) {
    this.world = world
    this.segment = segment
    this.pointer = Vec2(segment.start.x, segment.start.y)
  }

  moveTo (x, y) {
    this.pointer.x = x
    this.pointer.y = y
  }

  lineTo (x2, y2) {
    const x1 = this.pointer.x
    const y1 = this.pointer.y
    this.pointer.x = x2
    this.pointer.y = y2
    const width = x2 - x1
    const height = y2 - y1
    const step = Math.min(1, width / 10)
    const stepCount = Math.round(width / step)
    const stepX = width / stepCount

    const shape = (x) => {
      return -0.5 * height * (Math.cos((x / width) * Math.PI) - 1)
    }

    for (let i = 0; i < stepCount; i++) {
      const currentX = i * stepX
      const nextX = (i + 1) * stepX

      this.segment.addEdge(new GroundEdge(
        this.world,
        Vec2(
          x1 + currentX,
          y1 + shape(currentX)
        ),
        Vec2(
          x1 + nextX,
          y1 + shape(nextX)
        )
      ))
    }
  }
}
