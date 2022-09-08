import Coin from '../Coin'
import Stick from '../Stick'
import GroundEdge from '../GroundEdge'

export default function pyramidSegment (world, segment) {
  segment.addEdge(new GroundEdge(world, segment.start, segment.end))
  const x = segment.start.x + 1.5
  const y = segment.start.y

  const dx = Math.cos(Math.PI / 3)
  const dy = Math.sin(Math.PI / 3)

  const size = segment.data.size
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size - j; i++) {
      segment.addStick(new Stick(
        world,
        1,
        x + i * 1.2 + j * dx,
        y + dy / 2 + 1.1 * j,
        Math.PI * (1 / 3 + 0.5)
      ))
      segment.addStick(new Stick(
        world,
        1,
        x + dx + i * 1.2 + j * dx + 0.1,
        y + dy / 2 + 1.1 * j,
        Math.PI * (-1 / 3 + 0.5)
      ))
      if (i > 0) {
        segment.addStick(new Stick(
          world,
          1.2,
          x + (i - 1) * 1.2 + dx / 2 + 0.6 + j * dx,
          y + dy + 0.05 + 1.1 * j,
          Math.PI / 2
        ))
      }
      if (i === 0 || i === size - j - 1) {
        segment.addCoin(new Coin(
          world,
          x + 0.5 + (j - 0.5) * dx + i * 1.2,
          y + dy + 0.05 + 1.1 * (j - 0.5)
        ))
      }
    }
  }
}
