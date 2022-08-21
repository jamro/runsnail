import { Bodies } from "matter-js";
import { Graphics, Sprite } from "pixi.js";
import GameObject from "./GameObject";
export default class Ball extends GameObject {

  constructor(props = {}) {
    super()

    const radius = props.radius || 100;
    const x = props.x || 0;
    const y = props.y || 0;

    this.body = Bodies.circle(
      x,
      y,
      radius,
      props
    );
   
    this.container = new Graphics();
    this.container.beginFill(0x000000);
    this.container.drawCircle(0, 0, radius);
  }

  get physicBody() {
    return this.body;
  }

  get graphicContainer() {
    return this.container;
  }

  update() {

  }

  render() {
    this.container.position = this.body.position;
    this.container.rotation = this.body.angle;
  }


}