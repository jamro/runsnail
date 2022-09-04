import * as plank from 'planck';
import Coin from '../Coin';
import GroundEdge from "../GroundEdge"
import SineBuilder from '../SIneBuilder';
import Stick from '../Stick';

const Vec2 = plank.Vec2;

function sinSlope(world, segment, x1, y1, x2, y2, slope) {
  const width = x2 - x1;
  const height = y2 - y1;
  const step = Math.min(1, width/10);
  const stepCount = Math.round(width / step);
  const stepX = width / stepCount;
  const stepY = (slope || 0) / stepCount;

  const shape = (x) => {
    return -0.5 * height * (Math.cos((x/width)*Math.PI) - 1)
  }

  for(let i=0; i < stepCount; i++) {
    const currentX = i*stepX
    const nextX = (i+1)*stepX

    segment.addEdge(new GroundEdge(
      world,
      Vec2(
        x1 + currentX, 
        y1 + shape(currentX) + i*stepY
      ),
      Vec2(
        x1 + nextX,
        y1 + shape(nextX) + (i+1)*stepY
      )
    ))
  }
}


export default function gapSegment(world, segment) {
  const width = segment.end.x - segment.start.x;


  const builder = new SineBuilder(world, segment)
  builder.moveTo(segment.start.x, segment.start.y)
  builder.lineTo(
    segment.start.x + width * 0.3,
    segment.start.y - width * 0.1,
  )
  builder.lineTo(
    segment.start.x + width * 0.35,
    segment.start.y - width * 0.08,
  )
  builder.lineTo(
    segment.start.x + width * 0.5 - 0.2,
    segment.start.y - width * 0.2,
  )
  builder.lineTo(
    segment.start.x + width * 0.5 + 0.2,
    segment.start.y - width * 0.2,
  )
  builder.lineTo(
    segment.start.x + width * 0.65,
    segment.start.y - width * 0.08,
  )
  builder.lineTo(
    segment.start.x + width * 0.7,
    segment.start.y - width * 0.1,
  )
  builder.lineTo(
    segment.end.x,
    segment.end.y,
  )

  let i
  if(segment.data.coins) {
    for(i=1; i <=7; i++) {
      segment.addCoin(new Coin(
        world,
        segment.start.x + width * 0.35,
        segment.start.y - width * 0.08 + i - 0.5,
      ))
      segment.addCoin(new Coin(
        world,
        segment.start.x + width * 0.5,
        segment.start.y - width * 0.08 + i - 0.5,
      ))
      segment.addCoin(new Coin(
        world,
        segment.start.x + width * 0.65,
        segment.start.y - width * 0.08 + i - 0.5,
      ))
    }
  }
  
}