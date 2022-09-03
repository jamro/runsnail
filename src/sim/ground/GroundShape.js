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

function createHalfSineSegment(segment) {
  const width = 20 + Math.random()*20
  return new GroundSegment(
    'halfSine',
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + width , segment.end.y + (Math.random()*2 - 1)*0.5*width)
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

function createPyramidSegment(segment) {
  const size = 2 + Math.floor(Math.random()*3)
  return new GroundSegment(
    'pyramid', 
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + size + 3, segment.end.y),
    {
      size
    }
  )
}

function createRampSegment(segment) {
  const width = 30 + Math.random()*50
  return new GroundSegment(
    'ramp',
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + width , segment.end.y + (Math.random()-0.5 )*0.25*width),
    {
      coins: Math.random() > 0.5 ? true : false
    }
  )
}

function createBridgeSegment(segment) {
  const width = 50
  return new GroundSegment(
    'bridge',
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + width , segment.end.y - width*0.1)
  )
}

function createAtzodSegment(segment) {
  const width = 100
  return new GroundSegment(
    'atzod',
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + width , segment.end.y - width*0.1)
  )
}

export function getNextSegment(segment) {
  let result
  const rnd = Math.random()
  if(segment.index === 0) {
    result = createAtzodSegment(segment)
  } else if(segment.index < 10) {
    result = createSineSegment(segment)
  } else if(rnd > 0.75) {
    result = createTowerSegment(segment)
  } else if(rnd > 0.7) {
    result = createRampSegment(segment)
  } else if(rnd > 0.6) {
    result = createPyramidSegment(segment)
  } else if(rnd > 0.4) {
    result = createHalfSineSegment(segment)
  } else if(rnd > 0.38) {
    result = createBridgeSegment(segment)
  } else if(rnd > 0.30) {
    result = createAtzodSegment(segment)
  } else {
    result = createSineSegment(segment)
  }
  result.index = segment.index + 1
  return result
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
    Vec2(85, -20)
  )
}