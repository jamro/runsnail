import { EventEmitter } from 'events'

export default class InputController extends EventEmitter {
  constructor (doc) {
    super()
    this.doc = doc
    this._snail = null
    this._world = null
    this._view = null
    this.pointerDownHandler = this.activate.bind(this)
    this.pointerUpHandler = this.deactivate.bind(this)
    this.hook = null
    this.enabled = true
  }

  set world (world) {
    this._world = world
    this._snail = world.snail
  }

  get world () {
    return this._world
  }

  get view () {
    return this._view
  }

  set view (view) {
    if (this._view) {
      this._view.off('pointerdown', this.pointerDownHandler)
      this._view.off('pointerup', this.pointerUpHandler)
    }
    this._view = view
    this._view.interactive = true
    this._view.on('pointerdown', this.pointerDownHandler)
    this._view.on('pointerup', this.pointerUpHandler)
  }

  init () {
    this.doc.addEventListener('keydown', (e) => {
      if (e.code.toLocaleLowerCase() === 'space') {
        this.activate()
      }
    })
    this.doc.addEventListener('keyup', (e) => {
      if (e.code.toLocaleLowerCase() === 'space') {
        this.deactivate()
      }
    })

    this.doc.body.focus()
  }

  activate (e) {
    if (e && e.y < 60) {
      return
    }
    if (!this.enabled) {
      return
    }
    if (this.hook) {
      return
    }
    if (this._snail) {
      this._snail.run = true
    }
  }

  deactivate (e) {
    if (e && e.y < 60) {
      return
    }
    if (!this.enabled) {
      return
    }
    if (this.hook) {
      const hook = this.hook
      this.hook = null
      hook()
      return
    }
    if (this._snail) {
      this._snail.run = false
    }
  }
}
