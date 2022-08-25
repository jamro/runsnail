import { Graphics, Sprite } from "pixi.js";

export default class SnailView extends Sprite {

  constructor() {
    super()

    this._hidden = false;
    this.t = 0;

    this.bodyShape = Sprite.from('body.png')
    this.bodyShape.anchor.set(0.42, 0.1);
    this.bodyShape.scale.x = 0.007;
    this.bodyShape.scale.y = -0.007;

    this.body = new Sprite()
    this.body.addChild(this.bodyShape)

    this.addChild(this.body);

    this.shell = Sprite.from('shell.png')
    this.shell.scale.x = 0.007;
    this.shell.scale.y = -0.007;
    this.shell.anchor.set(0.5);
    this.addChild(this.shell);

    this.eyeRight = Sprite.from('eye.png')
    this.eyeRight.scale.x = 0.007;
    this.eyeRight.scale.y = -0.007;
    this.eyeRight.anchor.set(0.5, 1);
    this.eyeRight.x = 0.8
    this.eyeRight.rotation = -0.15
    this.eyeRight.y = -0.15
    this.body.addChild(this.eyeRight);

    this.eyeLeft = Sprite.from('eye.png')
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

  }

  get hidden() {
    return this._hidden;
  }

  set hidden(value) {
    this._hidden = value;
    this.body.visible = !value;

  }

  update() {
    const targetBodyScale = this.hidden ? 0 : 0.007;
    this.bodyShape.scale.x += (targetBodyScale - this.bodyShape.scale.x) * 0.05;

    const showEyes = this.bodyShape.scale.x >= 0.006

    this.eyeRight.visible = showEyes;
    this.eyeLeft.visible = showEyes;

    this.t = (this.t + 4) % 180;

    this.body.scale.x = 0.9 + 0.1 *  Math.sin((this.t / 180) * Math.PI)
    this.antiRotationContainer.rotation = -this.rotation;
  }


}