
export default class GameObject {

  constructor() {
    this.world = null
    this.body = null
    this.container = null
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

  }
}