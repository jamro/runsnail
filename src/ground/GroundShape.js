import * as plank from 'planck/dist/planck-with-testbed';
import GroundSegment from './GroundSegment';

const Vec2 = plank.Vec2;

function hasCoinAtX(x) {
  let y = -0.5;
  y += Math.sin(x/9)
  y += Math.sin(x/30)

  return (x > 10  && y > 0)
}

export function getGroundShape(x) {
  let y = - 0.1 * x
  y += 6 * Math.sin(x/7)
  y += 8 * Math.sin(x/30)
  y += 0.01 * x * Math.cos(0.2 + x/17)
  return Vec2(x, y)
}

export function getSegmentAtX(x) {
  const SEGMENT_WIDTH = 1
  const startX = Math.floor(x/SEGMENT_WIDTH)*SEGMENT_WIDTH

  return new GroundSegment(
    hasCoinAtX(x) ? 'coin' : 'slope',
    getGroundShape(startX),
    getGroundShape(startX+SEGMENT_WIDTH)
  )
}

export function getNextSegment(segment) {
  return getSegmentAtX(segment.end.x+0.001)
}

export function getPrevSegment(segment) {
  return getSegmentAtX(segment.start.x-0.001)
}

export function getStartSegment() {
  return getSegmentAtX(0)
}