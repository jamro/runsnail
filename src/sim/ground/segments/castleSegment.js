import Coin from '../Coin'
import SineBuilder from '../SineBuilder'
import Stick from '../Stick'

function buildTower (world, segment, x, y, height) {
  segment.addStick(new Stick(
    world,
    1,
    x,
    y + 0.5
  ))
  segment.addStick(new Stick(
    world,
    1,
    x + 1,
    y + 0.5
  ))
  segment.addStick(new Stick(
    world,
    1,
    x + 0.5,
    y + 1.05,
    Math.PI / 2
  ))
  segment.addCoin(new Coin(
    world,
    x + 0.5,
    y + 0.5
  ))
}

export default function castleSegment (world, segment) {
  const width = segment.end.x - segment.start.x

  const builder = new SineBuilder(world, segment)
  builder.moveTo(segment.start.x, segment.start.y)
  builder.lineTo(
    segment.start.x + width * 0.2,
    segment.start.y - width * 0.1
  )
  builder.lineTo(
    segment.start.x + width * 0.4,
    segment.start.y - width * 0.1 + 1
  )
  builder.lineTo(
    segment.start.x + width * 0.45,
    segment.start.y - width * 0.1
  )
  builder.lineTo(
    segment.start.x + width * 0.45 + 10,
    segment.start.y - width * 0.1
  )
  builder.lineTo(
    segment.end.x,
    segment.end.y
  )

  const castleX = segment.start.x + width * 0.45 + 0.5
  const castleY = segment.start.y - width * 0.1

  for (let i = 0; i <= segment.data.length; i++) {
    segment.addStick(new Stick(
      world,
      1,
      castleX + i,
      castleY + 0.5
    ))
    if (i > 0) {
      segment.addStick(new Stick(
        world,
        1,
        castleX + i - 0.5,
        castleY + 1.05,
        Math.PI / 2
      ))
      segment.addStick(new Stick(
        world,
        1,
        castleX + i - 0.5,
        castleY + 2.15,
        Math.PI / 2
      ))
    }
    segment.addStick(new Stick(
      world,
      1,
      castleX + i,
      castleY + 0.5 + 1.1
    ))

    if (i % 2 === 0 && i < segment.data.length) {
      segment.addCoin(new Coin(
        world,
        castleX + i + 0.5,
        castleY + 0.5
      ))
    }
    if ((i + 1) % 2 === 0 && i < segment.data.length) {
      segment.addCoin(new Coin(
        world,
        castleX + i + 0.5,
        castleY + 0.5 + 1.1
      ))
    }
  }

  buildTower(world, segment, castleX, castleY + 2.2)
  buildTower(world, segment, castleX + segment.data.length - 1, castleY + 2.2)
}
