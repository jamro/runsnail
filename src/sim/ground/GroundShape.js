import * as plank from 'planck';
import GroundSegment from './GroundSegment';

const Vec2 = plank.Vec2;

function createSineSegment(segment) {
  const width = 20 + Math.random()*20
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
  const width = 20 + Math.random()*10
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
      coins: Math.random() > 0.3 ? true : false
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

function createGapSegment(segment) {
  const width = 40 + Math.random()*40
  return new GroundSegment(
    'gap',
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + width , segment.end.y),
    {
      coins: true
    }
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
  
  const builders = [
    { score: 900, builder: createSineSegment },
    { score: 100, builder: createAtzodSegment },
    { score: 700, builder: createTowerSegment },
    { score: 300, builder: createRampSegment },
    { score: 500, builder: createPyramidSegment },
    { score: 500, builder: createHalfSineSegment },
    { score: 200, builder: createBridgeSegment },
    { score: 300, builder: createGapSegment },
  ]

  if(segment.index === 0) {
    result = createAtzodSegment(segment)
  } else if(segment.index < 5) {
    result = createSineSegment(segment)
  } else {
    const sum = builders.reduce((acc, builder) => acc + builder.score, 0)
    const rnd = Math.random()*sum
    let acc = 0
    for(let i = 0; i < builders.length; i++) {
      acc += builders[i].score
      if(acc > rnd) {
        result = builders[i].builder(segment)
        break
      }
    }
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