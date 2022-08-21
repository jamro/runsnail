import { Composite, World } from "matter-js";
import { EventEmitter } from "events";

export default class GameWorld extends EventEmitter {

  constructor(engine, app) {
    super();
    this.objects = [];
    this.engine = engine;
    this.app = app;
    this.cameraLock = null;
    this.app.ticker.add(() => {
      this.objects.forEach((object) => {
        object.update();
        object.render();
      })
      if(this.cameraLock) {
        const x = this.cameraLock.graphicContainer.x;
        const y = this.cameraLock.graphicContainer.y;
        this.app.stage.x = -x + this.app.renderer.width/2;
        this.app.stage.y = -y + this.app.renderer.height/2;
      }
      this.emit("tick");
    });
    
  }

  add(object) {
    object.world = this;
    this.objects.push(object);
    if(object.physicBody) {
      Composite.add(this.engine.world, object.physicBody);
    }
    if(object.graphicContainer) {
      this.app.stage.addChild(object.graphicContainer);
    }
    this.objects.push(object)
  }



}