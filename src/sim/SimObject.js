export default class SimObject {

  constructor() {
    this.parent = null
    this.view = null
  }

  contact(simObject) {
    
  }

  separate(simObject) {
    
  }

  update(dt) {
    
  }

  render() {

  }

  destroy() {
    if(this.view && this.view.parent) {
      this.view.parent.removeChild(this.view)
    }
  }
}