import { EventEmitter } from "events"

export default class InputController extends EventEmitter {
  constructor(doc) {
    super()
    this.doc = doc
    this._snail = null
    this.gameOverHandler = this.omGameOver.bind(this)
    this.gameOver = false;
  }

  set snail(snail) {
    if(this._snail) {
      this._snail.off('gameover', this.gameOverHandler)
    }
    this._snail = snail
    this._snail.on('gameOver', this.gameOverHandler)
  }

  get snail() {
    return this._snail
  }

  init() {
    this.doc.addEventListener('keydown', (e) => {
      if(e.code.toLocaleLowerCase() === 'space') {
        this.activate()
      }
    });
    this.doc.addEventListener('keyup', (e) => {
      if(e.code.toLocaleLowerCase() === 'space') {
        this.deactivate()
      }
    });

    this.doc.addEventListener('mousedown', () => this.activate())
    this.doc.addEventListener('mouseup', () => this.deactivate())
    this.doc.addEventListener('touchstart', () => this.activate())
    this.doc.addEventListener('touchend', () => this.deactivate())
  
    this.doc.body.focus()
  }

  activate() {
    if(this._snail && !this.gameOver) {
      this._snail.run = true
    }
  }

  deactivate() {
    if(this.gameOver) {
      this.gameOver = false
      this.emit('replay')
      return;
    }
    if(this._snail && !this.gameOver) {
      this._snail.run = false
    }
  }

  omGameOver() {
    this.gameOver = true
  }
}