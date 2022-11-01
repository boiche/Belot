import { GameObjects, Scene } from "phaser"
import { gameOptions } from "../../main";
import BelotGame from "../BelotEngine/Belot";
import Dealer from "../BelotEngine/Dealer";
import Player from "../BelotEngine/Player";

class GameTableScene extends Scene {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  _belotGame: BelotGame;
  players: Player[] = [];
  center: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0);
  container!: Phaser.GameObjects.Container;

  constructor() {
    super('PlayBelot');
    this._belotGame = new BelotGame();    
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

    this.cameras.main.once('camerafadeincomplete', function (camera: Phaser.Cameras.Scene2D.Camera) {
      Dealer.FirstDeal();      
    }); 

    this.cameras.main.fadeIn(1500);

    this.center = new Phaser.Geom.Point(window.innerWidth / 2, window.innerHeight / 2);
  }
}

export default GameTableScene
