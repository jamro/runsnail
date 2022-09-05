import { Graphics, Loader, Sprite } from "pixi.js";
import { 
  DEAD,
  GLIDING, 
  ROLLING, 
  SNAIL_MIN_SPEED, 
  STARTING, 
  WALKING 
} from "../sim/Snail";
import Cloud from "./Cloud";
import Dust from "./Dust";
import View from "./View";
import SleepAnim from "./SleepAnim";
import SoundPlayer from "../SoundPlayer";
import KnockoutAnim from "./KnockoutAnim";

export default class SnailView extends View {

  constructor(model) {
    super(model)
    this._hidden = false;
    this.prevState = STARTING
    this.prevEnergy = 1
    this.t = 0;

    this.bodyShape = Sprite.from(Loader.shared.resources.body.texture)
    this.bodyShape.anchor.set(0.42, 0.1);
    this.bodyShape.scale.x = 0.007;
    this.bodyShape.scale.y = -0.007;

    this.body = new Sprite()
    this.body.addChild(this.bodyShape)

    this.addChild(this.body);

    this.shell = Sprite.from(Loader.shared.resources.shell.texture)
    this.shell.scale.x = 0.007;
    this.shell.scale.y = -0.007;
    this.shell.anchor.set(0.5);
    this.addChild(this.shell);

    this.eyeRight = Sprite.from(Loader.shared.resources.eye.texture)
    this.eyeRight.scale.x = 0.007;
    this.eyeRight.scale.y = -0.007;
    this.eyeRight.anchor.set(0.5, 1);
    this.eyeRight.x = 0.8
    this.eyeRight.rotation = -0.15
    this.eyeRight.y = -0.15
    this.body.addChild(this.eyeRight);

    this.eyeLeft = Sprite.from(Loader.shared.resources.eye.texture)
    this.eyeLeft.scale.x = 0.0067;
    this.eyeLeft.scale.y = -0.0067;
    this.eyeLeft.anchor.set(0.5, 1);
    this.eyeLeft.x = 0.7
    this.eyeLeft.y = -0.18
    this.eyeLeft.rotation = 0.15
    this.body.addChild(this.eyeLeft);

    this.debug = new Graphics();
    this.debug.visible = false
    this.antiRotationContainer = new Sprite();
    this.antiRotationContainer.addChild(this.debug);
    this.addChild(this.antiRotationContainer);

    this.debug.beginFill(0xff0000);
    this.debug.drawRect(-0.05, 0, 0.1, 3);

    this.debug.beginFill(0x0000ff);
    this.debug.drawRect(0, -0.05, 3, 0.1);

    this.dust = new Dust()
    this.dust.scale.set(-0.02, -0.02)
    this.dust.x = 0
    this.dust.y = -0.5
    this.antiRotationContainer.addChild(this.dust)

    this.cloud = new Cloud()
    this.cloud.visible = false
    this.cloud.scale.set(0.007, -0.007)
    this.antiRotationContainer.addChild(this.cloud)

    this.knockout = new KnockoutAnim()
    this.antiRotationContainer.addChild(this.knockout)

    model.on('gameOver', data => {
      this.cloud.visible = true
      this.cloud.displayResult(data.distance)
    })

    model.on('replayPrompt', () => {
      this.cloud.visible = true
      this.cloud.displayReplayPrompt()
    })

    this.rollingSound = SoundPlayer.shared.get('roll')
    this.rollingSound.play()

    this.glidingSound = SoundPlayer.shared.get('wind')
    this.glidingSound.play()

    this.walkSound = SoundPlayer.shared.get('walk')
    this.walkSound.play()

    this.knockoutSound = SoundPlayer.shared.get('tweet')
    this.knockoutSound.play()

    this.sleepSound = SoundPlayer.shared.get('sleep')
    this.sleepSound.play()
    this.model.on('destroy', () => {
      this.sleepSound.volume(0)
    } )
    
    this.model.on('hitHard', () => {
      const hitSound = SoundPlayer.shared.get('hit')
      hitSound.play()
    })

    this.model.on('hitSoft', () => {
      const hitSound = SoundPlayer.shared.get('hitsoft')
      hitSound.play()
    })
  }

  get hidden() {
    return this._hidden;
  }

  set hidden(value) {
    this._hidden = value;
    this.body.visible = !value;
  }

  update() {
    this.knockout.active = this.model.knockoutTimer > 0
    this.knockoutSound.volume(this.model.knockoutTimer > 0 ? 1 : 0)

    // adjust to model state
    switch(this.model.state) {
      case STARTING:
        this.dust.enabled = false
        this.hidden = false
        break;
      case WALKING:
      case GLIDING:
        this.dust.enabled = false
        this.hidden = false
        break;
      case ROLLING:
        this.hidden = true
        if(this.model.isOnGround && this.model.body.getLinearVelocity().x > 5) {
          this.dust.enabled = true
          this.dust.rotation = Math.atan2(this.model.groundNormal.y, this.model.groundNormal.x) - Math.PI/2
        } else {
          this.dust.enabled = false
        }
        break;
      case DEAD:
        this.hidden = true
        this.dust.enabled = false
        break;
    }

    // updte body position
    this.x = this.model.body.getPosition().x
    this.y = this.model.body.getPosition().y
    this.rotation = this.model.body.getAngle()
    this.antiRotationContainer.rotation = -this.rotation;

    // show / hide snail body
    const targetBodyScale = this.hidden ? 0 : 0.007;
    this.bodyShape.scale.x += (targetBodyScale - this.bodyShape.scale.x) * 0.05;

    const showEyes = this.bodyShape.scale.x >= 0.006
    this.eyeRight.visible = showEyes;
    this.eyeLeft.visible = showEyes;

    // body movement animation
    if(this.model.state !== STARTING) {
      this.t = (this.t + 4) % 180; 
      this.body.scale.x = 0.9 + (this.hidden ? 0 : 0.1) *  Math.sin((this.t / 180) * Math.PI)
      if(!this.hidden) {
        this.shell.y = -0.07*Math.sin((this.t / 180) * Math.PI + 0.05)
      }
      this.eyeLeft.rotation = -0.4 * Math.sin((this.t / 180) * Math.PI)
      this.eyeRight.rotation = -0.4 * Math.sin((this.t / 180) * Math.PI) - 0.5
    }

    if(this.model.state === DEAD && Math.random() > 0.96) {
      this.antiRotationContainer.addChild(new SleepAnim())
    }

    let sound

    // power down sound
    if(this.model.energy === 0 && this.prevEnergy > 0) {
      SoundPlayer.shared.get('powerdown').play()
    }

    // start sound
    if(this.model.state !== STARTING && this.prevState === STARTING) {
      SoundPlayer.shared.get('fly').play('start')
    }

    // fly sound
    if(this.model.state === GLIDING && this.prevState !== GLIDING && this.model.body.getLinearVelocity().y > 1) {
      SoundPlayer.shared.get('fly').play('fly' + Math.floor(Math.random() * 9 + 1))
    }

    // rolling sound
    if(this.model.state === ROLLING && this.model.body.getPosition().x > 6) {
      this.rollingSound.volume(Math.min(1, Math.abs(this.model.body.getAngularVelocity())/40))
    } else {
      this.rollingSound.volume(0)
    }

    // gliding sound
    if(this.model.state === GLIDING) {
      this.glidingSound.volume(Math.min(1, this.model.flyTimer/400))
    } else {
      this.glidingSound.volume(0)
    }

    // walk sound
    if(this.model.state === WALKING) {
      this.walkSound.volume(Math.min(0.5, Math.abs(this.model.body.getLinearVelocity().x)/(3*SNAIL_MIN_SPEED)))
    } else {
      this.walkSound.volume(0)
    }

    // sleep sound
    if(this.model.state === DEAD) {
      this.sleepSound.volume(1)
    } else {
      this.sleepSound.volume(0)
    }

    this.prevState = this.model.state
    this.prevEnergy = this.model.energy
  }



}