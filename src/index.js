import * as plank from 'planck/dist/planck-with-testbed';
import GroundBuilder from './GroundBuilder.js'
import InputController from './InputController.js';
import Snail from './Snail.js';
const Vec2 = plank.Vec2;
const Circle = plank.Circle;

const WORLD_WIDTH = 100;
const MIN_SPEED = 3;
plank.testbed('Boxes', function(testbed) {
  const world = plank.World(Vec2(0, -10));

  const snail = new Snail(world)
  const controller = new InputController(document, snail)
  controller.init()
  const groundBuilder = new GroundBuilder(world)

  testbed.step = function() {
    groundBuilder.build(snail.body.getPosition().x, WORLD_WIDTH)
    testbed.x = snail.body.getPosition().x
    testbed.y = -snail.body.getPosition().y

    snail.update()
  };
  


  return world
});