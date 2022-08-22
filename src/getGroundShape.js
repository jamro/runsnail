import * as plank from 'planck/dist/planck-with-testbed';

const Vec2 = plank.Vec2;

export default function getGroundShape(x) {
  let y = - 0.1 * x
  y += 6 * Math.sin(x/7)
  y += 8 * Math.sin(x/30)
  y += 0.01 * x * Math.cos(0.2 + x/17)
  return Vec2(x, y)
}