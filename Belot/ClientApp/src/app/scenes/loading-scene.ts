import { Scene } from "phaser";

class LoadingScene extends Scene {
  constructor() {
    super("LoadingBelot");
  }

  create() {
    this.showLoader();
  }

  showLoader() {
    this.add.image(0, 0, "background").setDisplaySize(window.innerWidth, window.innerHeight).setOrigin(0);
  }
}

export default LoadingScene
