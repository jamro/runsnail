import * as plank from 'planck/dist/planck-with-testbed';
import GroundSegment from './GroundSegment';

const Vec2 = plank.Vec2;

function createSineSegment(segment) {
  const width = 20 + Math.random()*50
  return new GroundSegment(
    'sine',
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + width , segment.end.y + (Math.random()-0.4 )*0.25*width),
    {
      amplitude: Math.max(2, Math.random()*width*0.25),
      coins: Math.random() > 0.8 ? true : false
    }
  )
}

export function getNextSegment(segment) {
  return createSineSegment(segment)
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
    'line',
    Vec2(-1, 0),
    Vec2(1, 0)
  )
}