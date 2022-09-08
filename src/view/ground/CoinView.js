import { Loader, Sprite } from 'pixi.js'
import View from '../View'
import SoundPlayer from '../../SoundPlayer'

export default class CoinView extends View {
  constructor (model) {
    super(model)

    this.view = Sprite.from(Loader.shared.resources.coin.texture)
    this.view.scale.set(0.005, -0.005)
    this.view.anchor.set(0.5, 0.5)
    this.view.cacheAsBitmap = true
    this.addChild(this.view)
    this.update()

    this.model.on('collect', () => {
      const collectSound = SoundPlayer.shared.get('coin')
      collectSound.play()
    })
  }

  update () {
    this.x = this.model.body.getPosition().x
    this.y = this.model.body.getPosition().y
  }
}
