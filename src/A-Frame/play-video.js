export const playVideoComponent = {
  schema: {
    video: { type: 'string' },
  },
  init() {
    const v = document.querySelector(this.data.video)
    v.play()
  },
  remove() {
    const v = document.querySelector(this.data.video);
    if (!!v) {
      v.pause();
      v.currentTime = 0;
    }
  }
}