import { EventEmitter } from "events"

export default class InputController extends EventEmitter {
  constructor(doc) {
    super()
    this.doc = doc
    this._snail = null
    this._world = null
    this._view = null
    this.gameOverHandler = this.onGameOver.bind(this)
    this.replayPromptHandler = this.onReplayPrompt.bind(this)
    this.pointerDownHandler = this.activate.bind(this)
    this.pointerUpHandler = this.deactivate.bind(this)
    this.gameOver = false;
    this.splash = true;
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

  get view() {
    return this._view
  }

  set view(view) {
    if(this._view) {
      this._view.off('pointerdown', this.pointerDownHandler)
      this._view.off('pointerup', this.pointerUpHandler)
    }
    this._view = view
    this._view.interactive = true
    this._view.on('pointerdown', this.pointerDownHandler)
    this._view.on('pointerup', this.pointerUpHandler)
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
  
    this.doc.body.focus()
  }

  activate(e) {
    if(e && e.y < 60) {
      return
    }
    if(this._snail && !this.splash && !this.gameOver && !this._world.infoActive) {
      this._snail.run = true
    }
  }

  deactivate(e) {
    if(e && e.y < 60) {
      return
    }
    if(this.splash) {
      this.splash = false
      this.emit('start')
      return;
    }
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