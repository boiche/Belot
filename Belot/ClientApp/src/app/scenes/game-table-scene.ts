import { Scene } from "phaser"
import BelotGame from "../BelotEngine/Belot";
import Dealer from "../BelotEngine/Dealer";

class GameTableScene extends Scene {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  _belotGame: BelotGame;
  

  constructor() {
    super('PlayBelot');
    this._belotGame = new BelotGame;    
  }  

  create() {
    Dealer._scene = this;
    Dealer.initDeck();
    var image = this.add.image(0, 0, "tableCloth").setDepth(-1).setOrigin(0).setDisplaySize(this.windowWidth, this.windowHeight).setVisible(true);
    this.tweens.add({
      targets: image,
      x: 0,      
      ease: Phaser.Math.Easing.Sine.Out,
      yoyo: false,
      duration: 1000
    });

    this.cameras.main.once('fadeInComplete', function (camera: Phaser.Cameras.Scene2D.Camera) {
      camera.fadeOut(1500);
    }); 

    this.cameras.main.fadeIn(1500);
    setTimeout(() => Dealer.FirstDeal(), 1500);
  }
}

export default GameTableScene
