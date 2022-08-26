import { Emitter } from "@pixi/particle-emitter";
import { Container, Texture } from "pixi.js";

export default class Dust extends Container {
  
  constructor() {
    super();
    this.enabled = false;
    this.scale.x = -1
    this.emitter = new Emitter(
      this,
      {
        lifetime: {
          min: 0.5,
          max: 1
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 0.31,
        maxParticles: 1000,
        pos: {
          x: 0,
          y: 0
        },
        addAtBack: false,
        behaviors: [
          {
            type: 'scale',
            config: {
              scale: {
                list: [
                  { value: 0.1, time: 0 },
                  { value: 0.01, time: 1 }
                ],
              },
            }
          },
          {
            type: 'moveSpeed',
            config: {
              speed: {
                list: [
                  { value: 200, time: 0 },
                  { value: 100 , time: 1 }
                ],
                isStepped: false
              },
            }
          },
          {
            type: "moveAcceleration",
            config: {
              accel: {
                x: 0,
                y: 600 
              },
              minStart: 600,
              maxStart: 600,
              rotate: true
            }
          },
          {
            type: 'rotationStatic',
            config: { min: -45, max: 45 }
          },
          {
            type: 'spawnShape',
            config: {
              type: 'torus',
              data: {
                x: 0,
                y: 0,
                radius: 10
              }
            }
          },
          {
            type: 'textureSingle',
            config: {
              texture: Texture.from('particle.png')
            }
          }
        ],
      }
    );
    
  }

  render(renderer) {
    super.render(renderer)
    this.emitter.emit = this.enabled
    this.emitter.update(0.01);
  }
}