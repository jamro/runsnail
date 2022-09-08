
import Coin from '../Coin'
import SineBuilder from '../SineBuilder'

export default function gapSegment (world, segment) {
  const width = segment.end.x - segment.start.x

  const builder = new SineBuilder(world, segment)
  builder.moveTo(segment.start.x, segment.start.y)
  builder.lineTo(
    segment.start.x + width * 0.3,
    segment.start.y - width * 0.1
  )
  builder.lineTo(
    segment.start.x + width * 0.35,
    segment.start.y - width * 0.08
  )
  builder.lineTo(
    segment.start.x + width * 0.5 - 0.2,
    segment.start.y - width * 0.2
  )
  builder.lineTo(
    segment.start.x + width * 0.5 + 0.2,
    segment.start.y - width * 0.2
  )
  builder.lineTo(
    segment.start.x + width * 0.65,
    segment.start.y - width * 0.08
  )
  builder.lineTo(
    segment.start.x + width * 0.7,
    segment.start.y - width * 0.1
  )
  builder.lineTo(
    segment.end.x,
    segment.end.y
  )

  let i
  const coins = segment.data.coins || 0
  if (segment.data.coins) {
    for (i = 1; i <= 7; i++) {
      if (coins >= 3) {
        segment.addCoin(new Coin(
          world,
          segment.start.x + width * 0.35,
          segment.start.y - width * 0.08 + i - 0.5
        ))
      }
      if (coins === 2 || coins >= 4) {
        segment.addCoin(new Coin(
          world,
          segment.start.x + width * 0.425,
          segment.start.y - width * 0.08 + i - 0.5
        ))
      }
      if (coins === 1 || coins === 3 || coins === 5) {
        segment.addCoin(new Coin(
          world,
          segment.start.x + width * 0.5,
          segment.start.y - width * 0.08 + i - 0.5
        ))
      }
      if (coins === 2 || coins >= 4) {
        segment.addCoin(new Coin(
          world,
          segment.start.x + width * 0.575,
          segment.start.y - width * 0.08 + i - 0.5
        ))
      }
      if (coins >= 3) {
        segment.addCoin(new Coin(
          world,
          segment.start.x + width * 0.65,
          segment.start.y - width * 0.08 + i - 0.5
        ))
      }
    }
  }
}
