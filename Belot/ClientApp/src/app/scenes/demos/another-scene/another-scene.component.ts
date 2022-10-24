import { Scene } from 'phaser';
import { gameOptions } from '../../../../main';

export class AnotherSceneDemo extends Scene {

  constructor() {
    super("BootGame");
  }

  preload() {
    let frameConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: gameOptions.cardWidth,
      frameHeight: gameOptions.cardHeight      
    };
    this.load.image("emptytile", "assets/sprites/demo/tile.png");
    this.load.spritesheet("tiles", "assets/sprites/demo/sprite_sheet.png", frameConfig);
  }

  create() {
    console.log("game is booting...");
    this.scene.start("PlayGame");
  }
}
