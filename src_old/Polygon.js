import { Bodies } from "matter-js";
import { Graphics, Sprite } from "pixi.js";
import GameObject from "./GameObject";

export default class Polygon extends GameObject {

  constructor(props = {}) {
    super()

    const points = props.points || [
      {x: 0, y: 0},
      {x: 1000, y: 100},
      {x: 1000, y: 120},
      {x: 0, y: 0},
    ];
    const x = props.x || 0;
    const y = props.y || 0;

    this.body = Bodies.fromVertices(
      x,
      y,
      points,
      props
    );

    const offsetX = -x + this.body.bounds.min.x
    const offsetY = -y + this.body.bounds.min.y
   
    this.container = new Graphics();
    this.container.beginFill(0x000000);
    this.container.moveTo(this.body.points[0].x + offsetX, this.body.points[0].y + offsetY);
    for (let i = 1; i < this.body.points.length; i++) {
      this.container.lineTo(this.body.points[i].x + offsetX, this.body.points[i].y + offsetY);
    }
    
  }

  render() {
    this.container.position = this.body.position;
    this.container.rotation = this.body.angle;
  }


}