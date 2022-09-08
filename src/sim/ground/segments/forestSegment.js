import Coin from '../Coin'
import SineBuilder from '../SineBuilder'
import Stick from '../Stick'

export default function forestSegment (world, segment) {
  const width = segment.end.x - segment.start.x
  const height = segment.end.y - segment.start.y

  const builder = new SineBuilder(world, segment)
  builder.moveTo(segment.start.x, segment.start.y)
  builder.lineTo(
    segment.start.x + width * 0.4,
    segment.start.y + height * 0.5
  )
  builder.lineTo(
    segment.start.x + width * 0.6,
    segment.start.y + height * 0.5
  )
  builder.lineTo(
    segment.end.x,
    segment.end.y
  )
  let y
  for (let x = segment.start.x + width * 0.4; x <= segment.start.x + width * 0.6; x += 1) {
    const treeSize = 1 + Math.floor(Math.random() * 3)
    const canopySize = 1 + Math.floor(Math.random() * 2)

    for (y = 0; y < treeSize; y++) {
      segment.addStick(new Stick(
        world,
        0.5,
        x,
        segment.start.y + height * 0.5 + 0.25 + y * 0.5
      ))
    }
    for (y = 0; y < canopySize; y++) {
      segment.addCoin(new Coin(
        world,
        x,
        segment.start.y + height * 0.5 + 0.5 + treeSize * 0.5 + y
      ))
    }
  }
}
