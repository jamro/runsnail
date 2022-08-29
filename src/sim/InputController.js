import { EventEmitter } from "events"

export default class InputController extends EventEmitter {
  constructor(doc) {
    super()
    this.doc = doc
    this._snail = null
    this._world = null
    this.gameOverHandler = this.onGameOver.bind(this)
    this.replayPromptHandler = this.onReplayPrompt.bind(this)
    this.gameOver = false;
    this.replayPrompt = false;
  }

  set world(world) {
    if(this._snail) {
      this._snail.off('gameover', this.gameOverHandler)
    }
    this._world = world
    this._snail = world.snail
    this._snail.on('gameOver', this.gameOverHandler)
    this._snail.on('replayPrompt', this.replayPromptHandler)
  }

  get world() {
    return this._world
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
    if(this._snail && !this.gameOver && !this._world.infoActive) {
      this._snail.run = true
    }
  }

  deactivate() {
    if(this._world.infoActive) {
      this._world.infoActive = false
      return;
    }
    if(this.gameOver && this.replayPrompt) {
      this.gameOver = false
      this.replayPrompt = false
      this.emit('replay')
      return;
    }
    if(this._snail && !this.gameOver) {
      this._snail.run = false
    }
  }

  onGameOver() {
    this.gameOver = true
  }

  onReplayPrompt() {
    this.replayPrompt = true
  }
}