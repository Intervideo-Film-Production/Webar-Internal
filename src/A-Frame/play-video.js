
export const playVideoComponent = {
  pausePrevious: null, 
  schema: {
    video: { type: 'string' },
  },
  init() {
    const v = document.querySelector(this.data.video)
    console.log("play");
    setTimeout(() => {
      v.play();
    }, 200)
  },
  tick() {
    const v = document.querySelector(this.data.video)

    const mesh = document.querySelector("#alphaVideoMesh");
    const productVideoShouldPause = mesh.getAttribute("product-video-pause");
    if(productVideoShouldPause === this.pausePrevious) return;

    if (productVideoShouldPause === "true") {
      v.pause();
    }else {
      v.play();
    }
    this.pausePrevious = productVideoShouldPause;
  },
  remove() {
    const v = document.querySelector(this.data.video);
    if (!!v) {
      v.pause();
      v.currentTime = 0;
    }
  }
}