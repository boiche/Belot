import { Scene } from "phaser";
import { gameOptions } from "../../main";

class BootGameScene extends Scene {
  constructor() {
    super("BootBelot");
  }

  preload() {    
    let frameConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: gameOptions.cardWidth,
      frameHeight: gameOptions.cardHeight
    };

    let backgroundConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: window.innerWidth,
      frameHeight: window.innerHeight      
    };

    this.load.spritesheet("cards", "assets/sprites/cards_svg.png", frameConfig);
    this.load.spritesheet("belotCards", "assets/sprites/belot_spritesheet.png", frameConfig);
    this.load.spritesheet("background", "assets/sprites/Background.png", backgroundConfig);
    this.load.image("tableCloth", "assets/sprites/table_cloth.png");
  }

  create() {
    console.log("game is booting...");
    this.add.sprite(0, 0, "background").setOrigin(0);
    // simulate longer loading process
    setTimeout(() => { console.log('completed'); this.scene.start("PlayBelot"); }, 2500);
  }
}

export default BootGameScene
