import * as plank from 'planck/dist/planck-with-testbed';
import Ground from './ground/Ground.js'
import InputController from './sim/InputController.js';
import Snail from './Snail.js';
const Vec2 = plank.Vec2;

const WORLD_WIDTH = 500 ;
plank.testbed('RunSnail', function(testbed) { 
  const status = document.getElementById('status')
  const world = plank.World(Vec2(0, -10));

  world.on('begin-contact', (contact) => {
    const objA = contact.getFixtureA().objRef
    const objB = contact.getFixtureB().objRef

    if(!objA || !objB) {
      return
    } 
    if(objA.contact) {
      objA.contact(objB, contact)
    }
    if(objB.contact) {
      objB.contact(objA, contact)
    }
  })

  world.on('end-contact', (contact) => {
    const objA = contact.getFixtureA().objRef
    const objB = contact.getFixtureB().objRef
    if(!objA || !objB) {
      return
    } 
    if(objA.separate) {
      objA.separate(objB, contact)
    }
    if(objB.separate) {
      objB.separate(objA, contact)
    }
  })

  const snail = new Snail(world)
  const controller = new InputController(document, snail)
  controller.init()
  const ground = new Ground(world)

  testbed.step = function() {
    ground.build(snail.body.getPosition().x, WORLD_WIDTH)
    ground.update() 
    snail.update()
    testbed.x = snail.body.getPosition().x
    testbed.y = -snail.body.getPosition().y
    status.innerHTML = `SCORE: ${snail.coins } ${snail.state}`
  };

  return world
});