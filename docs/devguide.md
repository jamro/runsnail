# Start Development

To start further development, follow the steps below:

- clone the repository `git clone https://github.com/jamro/runsnail.git`
- install dependencies 
```bash
cd runsnail
npm install
```
- start the development server
```bash
npm run start
```
- open the browser at `http://localhost:8080`

# Techologies Used

## Game Engine

- [Planck.js](https://github.com/shakiba/planck.js/) - 2D physics engine, JavaScript port of Box2D
- [Pixi.js](https://pixijs.com/) - 2D rendering engine
- [Howler.js](https://howlerjs.com/) - audio library

## Build Tools

- [Webpack](https://webpack.js.org/) - module bundler
- [Babel](https://babeljs.io/) - JavaScript compiler
- [ESLint](https://eslint.org/) - JavaScript linter
- [Commitizen](https://github.com/commitizen/cz-cli) - commit message convention

# Architecture

Game physic simulation and rendering of visuals run in independent loops. Such an approach decouples both, reducing the impact of performance issues. Low renderer performance will drop frames per second but should not impact the speed of game simulation.

## Game Simulation

### Physic Objects Structure

Game objects are aggregated in `World` objects and are organized as a tree structure. Since `Box2D/Planck.js` does not support the nesting of physic objects, it is extended by `SimObject` and `SimContainer` classes. `SimContainer` may aggregate other `SimContainer` objects and `SimObject` objects. `SimObject` is the leaf of the tree and cannot nest further objects.

For Example:
```
 - World (extends SimContainer)
   |- Snail (extends SimObject)
   |- Ground (extends SimContainer)
      |- GroundSegment (extends SimContainer)
         |- GroundEdge (extends SimObject)
         |- GroundEdge (extends SimObject)
         |- GroundEdge (extends SimObject)
         |- Coin (extends SimObject)
         |- ...
      |- GroundSegment (extends SimContainer)
         |- ...
      |- GroundSegment (extends SimContainer)
         |- ...
```

Each `SimContainer` and `SimObject` classes implements `update()` method which is called by the main game loop. This is a suitable place to implement all the logic related to the game object (e.g. applying forces, updating object state, etc...). The creation of `Box2D/Planck.js` objects should be implemented in the constructor of `SimObject`. Both `SimContainer` and `SimObject` implements also `destroy()` method which should contain all object clean up code. Call of `update()` an `destroy()` are propagated by `SimContainer` to all its children.

### Collision Handling

To make collision detection easier, each `SimObject` class implements `contact()` and `separate()` methods. The first one is called whenever a collision is started, the second is executed when the contact ends. 

The mechanism above works only for fixtures that has `objRef` property pointing to related `SimObject` instance. For example:

```javascript
class ExampleObject extends SimObject {
  constructor (world, x, y) {
    super()
    this.body = world.createBody().setDynamic()
    const fixture = this.body.createFixture(Circle(0.5))

    // set reference to this object
    fixture.objRef = this
    this.body.setPosition(Vec2(x, y))
  }

}
```

### Snail Physics

The snail object is composed of two overlapping fixtures. One is `dynamic` and represents the Snail body (`body`). All physic forces and torque are applied to that object. The `body` collides with the ground but not with obstacles (e.g. sticks). 

The other fixture is `Kinematic` and collides with obstacles (`pusher`). Such an approach allows collision with obstacles that do not affect Snail movement and cannot block it. The `pusher` follows the position of the `body` in each simulation step. 

### Ground Generation

The ground is generated randomly and is composed of predefined segments. The order of segments is defined in `src/sim/ground/GroundShape.js`. It contains a few additional rules limiting the randomness. The actual logic that builds ground segments is located in `src/sim/ground/segment/*Segment.js` files

## Rendering

The game engine runs independently from rendering and can work without any visualization. The renderer depends on the game engine's models and displays all visuals reflecting the state of the game. Each visual object should extend `View` class.


# Adding new Ground Segment

- Extend `src/sim/ground/segment/Segment.js` by adding segment metadata here:

```javascript

function createCustomSegment (segment) {
  return new GroundSegment(
    'custom',
    Vec2(segment.end.x, segment.end.y),
    Vec2(segment.end.x + 10, segment.end.y),
    {
      coin: Math.random() > 0.5
    }
  )
}

export function getNextSegment (segment) {
  let result

  const builders = [
    { score: 1200, builder: createSineSegment },
    //...
    // add your segment buildier 
    // and probability score here
    { score: 300, builder: createCustomSegment }
  ]

   //...
}
```

- Create a segment file in `src/sim/ground/segments/customSegment.js`:

```javascript
import Coin from '../Coin'
import GroundEdge from '../GroundEdge'
import SineBuilder from '../SineBuilder'
import * as plank from 'planck'

const Vec2 = plank.Vec2


export default function customSegment (world, segment) {
  const width = segment.end.x - segment.start.x

  const builder = new SineBuilder(world, segment)
  builder.moveTo(segment.start.x, segment.start.y)
  builder.lineTo(
    segment.start.x + width/2,
    segment.start.y + 2
  )
  builder.lineTo(
    segment.end.x,
    segment.end.y
  )
  if(segment.data.coin) {
    segment.addCoin(new Coin(
      world,
      segment.start.x + width/2,
      segment.start.y + 3
    ))
  }
}

```

- Register the segment in `src/sim/ground/Ground.js`:

```javascript

  export default class Ground extends SimContainer {
  
    //...

    buildSegment (segment) {
      const builders = {
        start: startSegment,
        //...
        custom: customSegment
      }
      //...
    }
  
  }


```