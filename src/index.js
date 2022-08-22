import * as plank from 'planck/dist/planck-with-testbed';
import GroundBuilder from './GroundBuilder.js'
const Vec2 = plank.Vec2;
const Box = plank.Box;
const Edge = plank.Edge;
const Circle = plank.Circle;

const WORLD_WIDTH = 100;


plank.testbed('Boxes', function(testbed) {
  var world = plank.World(Vec2(0, -10));

  var snail = world.createBody().setDynamic();
  snail.createFixture(Circle(0.5));
  snail.setPosition(Vec2(0, 10));
  snail.setMassData({
    mass : 1,
    center : Vec2(),
    I : 1
  })

  const groundBuilder = new GroundBuilder(world)

  testbed.step = function() {
    groundBuilder.build(snail.getPosition().x, WORLD_WIDTH)
    testbed.x = snail.getPosition().x
    testbed.y = -snail.getPosition().y
  };


  return world
});