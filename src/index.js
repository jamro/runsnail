import * as plank from 'planck/dist/planck-with-testbed';
import InputController from './sim/InputController.js';
import Simulation from './Simulation.js';

plank.testbed('RunSnail', function(testbed) { 
  const status = document.getElementById('status')
  const sim = new Simulation()
  sim.init()

  const controller = new InputController(document, sim.snail)
  controller.init()

  testbed.step = function() {
    sim.update()
    testbed.x = sim.snail.body.getPosition().x
    testbed.y = -sim.snail.body.getPosition().y
    status.innerHTML = `SCORE: ${sim.snail.coins } ${sim.snail.state}`
  };

  return sim.world
});