import * as plank from 'planck';
import GroundSegment from './GroundSegment';

const Vec2 = plank.Vec2;

function createSineSegment(segment) {
  const width = 30 + Math.random()*30
  return new GroundSegment(
    'sine',
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + width , segment.end.y + (Math.random()-0.5 )*0.25*width),
    {
      amplitude: Math.max(2, Math.random()*width*0.25),
      coins: Math.random() > 0.6 ? true : false
    }
  )
}

function createTowerSegment(segment) {
  const width = 3
  const columns = Math.floor(Math.random()*Math.random()*10 ) + 1
  return new GroundSegment(
    'tower', 
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + width*columns  , segment.end.y),
    {
      levels: Array(columns).fill(0).map(() => 2 + Math.round(4*Math.random()))
    }
  )
}

export function getNextSegment(segment) {
  const rnd = Math.random()
  if(rnd > 0.7) {
    return createTowerSegment(segment)
  }
  return createSineSegment (segment)
}

export function getPrevSegment(segment) {
  return new GroundSegment(
    'line',
    Vec2(segment.start.x-100, segment.start.y),
    Vec2(segment.start.x, segment.start.y)
  )
}

export function getStartSegment() {
  return new GroundSegment(
    'start',
    Vec2(0, 0),
    Vec2(100, -20)
  )
}