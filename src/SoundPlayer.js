import EventEmitter  from 'events';

class SoundPlayer extends EventEmitter {
  constructor() {
    super()

    this.configs = {}
    this.sounds = {}
  }

  reset() {
    const ids = Object.keys(this.sounds)
    for(let i = 0; i < ids.length; i++) {
      const id = ids[i]
      const sound = this.sounds[id]
      if(sound) {
        sound.stop()
        if(this.configs[id].volume) {
          sound.volume(this.configs[id].volume)
        }
      }
    }
  }

  add(id, config) {
    this.configs[id] = config
  }

  load() {
    const loadStep = (queue, totalCount) => {
      const queueTotalSize = totalCount === undefined ? queue.length : totalCount
      if(queue.length === 0) {
        this.emit('progress', 99.999)
        setTimeout(() => this.emit('loaded'), 100)
        return
      }
      this.sounds[queue[0]] = new Howl({
        ...this.configs[queue[0]],
        preload: false
      })
      this.sounds[queue[0]].once('load', () => {
        this.emit('progress', 100*(queueTotalSize - queue.length + 1)/queueTotalSize)
        loadStep(queue.slice(1), queueTotalSize)
      });
      this.sounds[queue[0]].once('loaderror', (id, err) => {
        console.log(id, err)
        this.emit('error', err)
      });
      this.sounds[queue[0]].load()
    }

    const allSounds = Object.keys(this.configs)
    loadStep(allSounds);
  }

  get(id) {
    return this.sounds[id]
  }

}

SoundPlayer.shared = new SoundPlayer()

export default SoundPlayer