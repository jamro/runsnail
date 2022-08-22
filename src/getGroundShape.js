import * as plank from 'planck/dist/planck-with-testbed';

const Vec2 = plank.Vec2;


export default function getGroundShape(x) {
  let y = - x * 0.6 
  y += 1.1 * Math.cos(x/2)
  y += 3 * Math.cos(0.7 + x/7)
  y += 2 * Math.cos(1.1 + x/20)
  y += 5 * Math.cos(0.2 + x/100)
  y += 0.01 * x * Math.cos(0.2 + x/17)
  return Vec2(x, y)
}