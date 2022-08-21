import { Body } from "matter-js";
import { Graphics } from "pixi.js";
import Polygon from "./Polygon.js";

export default class GroundSegment extends Polygon {

  constructor(props = {}) {
    const points = [{x: 0, y: 0}]
    let yMax = 0;
    const segmentWidth = 50;
    const segmentCount = 10

    for(let i=1 ; i <= segmentCount ; i++) {
      points.push({x: i*segmentWidth, y: Math.random()*40 + i*30});
      yMax = Math.max(yMax, points[i].y);
    }
    const endPoint = {
      x: points[segmentCount].x,
      y: points[segmentCount].y
    };
    points.push({x: points[points.length-1].x, y: yMax+20});
    points.push({x: 0, y: yMax+20});
    const x = props.x || 0;
    const y = props.y || 0;

    endPoint.x += x;
    endPoint.y += y;

    super({
      x,
      y,
      isStatic: true, 
      points
    });
    this.endPoint = endPoint;
    this.startPoint = {x, y};

    const offsetX = -x + this.body.bounds.min.x
    const offsetY = -y + this.body.bounds.min.y
   
    this.container = new Graphics();
    this.container.lineStyle(6, 0x000000);
    this.container.moveTo(this.body.points[0].x + offsetX, this.body.points[0].y + offsetY);
    for (let i = 1; i < this.body.points.length-2; i++) {
      this.container.lineTo(this.body.points[i].x + offsetX, this.body.points[i].y + offsetY);
    }

    this.moveTo(x, y)

  }

  moveTo(x, y) {
    const x1 = this.body.bounds.min.x;
    const x2 = this.body.bounds.max.x;
    const y1 = this.body.bounds.min.y;
    const y2 = this.body.bounds.max.y;

    Body.setPosition(this.body, {
      x: x + (x2 - x1)/2 - (x2 + x1)/2 + this.body.position.x,
      y: y + (y2 - y1)/2 - (y2 + y1)/2 + this.body.position.y
    });


    const segmentWidth = (this.endPoint.x - this.startPoint.x)
    const segmentHeight = (this.endPoint.y - this.startPoint.y)
    this.startPoint.x = x
    this.startPoint.y = y
    this.endPoint.x = x + segmentWidth
    this.endPoint.y = y + segmentHeight
  }



}