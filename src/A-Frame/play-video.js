export const playVideoComponent = {
  schema: {
    video: { type: 'string' },
  },
  init() {
    const v = document.querySelector(this.data.video)
    console.log("play from here");
    v.play()
  },
  remove() {
    const v = document.querySelector(this.data.video);
    if (!!v) {
      console.log("pause");
      v.pause();
      v.currentTime = 0;
    }
  }
}