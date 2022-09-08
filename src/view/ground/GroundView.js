import View from '../View'
import GroundSegmentView from './GroundSegmentView'

export default class GroundView extends View {
  constructor (model) {
    super(model)

    this.segments = []

    model.on('addSegment', segment => {
      const view = new GroundSegmentView(segment)
      this.segments.push({
        model: segment,
        view
      })
      this.addChild(view)
      segment.on('destroy', () => {
        this.segments = this.segments.filter(s => s.model !== segment)
        this.removeChild(view)
      })
    })
  }

  update () {
    this.segments.forEach(segment => segment.view.update())
  }
}
