export default class InputController {
  constructor(doc, snail) {
    this.doc = doc
    this.snail = snail
  }

  init() {
    this.doc.addEventListener('keydown', (e) => {
      if(e.code.toLocaleLowerCase() === 'space') {
        this.snail.run = true
      }
    });
    this.doc.addEventListener('keyup', (e) => {
      if(e.code.toLocaleLowerCase() === 'space') {
        this.snail.run = false
      }
    });
  
    this.doc.body.focus()
  }
}