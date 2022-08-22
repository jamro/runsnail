import { Bodies } from "matter-js";
import { Graphics, Sprite } from "pixi.js";
import GameObject from "./GameObject";
export default class Box extends GameObject {

  constructor(props = {}) {
    super()

    const width = props.width || 100;
    const height = props.height || 100;
    const x = props.x || 0;
    const y = props.y || 0;

    this.body = Bodies.rectangle(
      x,
      y,
      width,
      height,
      props
    );
   
    this.container = new Graphics();
    this.container.beginFill(0x000000);
    this.container.drawRect(-width/2, -height/2, width, height);
  }

  render() {
    this.container.position = this.body.position;
    this.container.rotation = this.body.angle;
  }


}