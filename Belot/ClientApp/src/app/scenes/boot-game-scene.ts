import { Scene } from "phaser";
import { constants, gameOptions } from "../../main";
import { SignalRPlugin } from './main-scene';

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
    this.load.image("background", "assets/sprites/Background.png");
    this.load.spritesheet("cardBack", "assets/sprites/back.png", frameConfig);
    this.load.image("tableCloth", "assets/sprites/table_cloth.png");
    this.load.image(constants.clubGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_clubs.png");
    this.load.image(constants.diamondsGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_diamonds.png");
    this.load.image(constants.heartsGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_hearts.png");
    this.load.image(constants.spadesGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_spades.png");
    this.load.image(constants.noSuitGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_no_suit.png");
    this.load.image(constants.allSuitsGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_all_suits.png");
    this.load.image(constants.doubleGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_double.png");
    this.load.image(constants.redoubleGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_re-double.png");
    this.load.image(constants.passGameAnnouncement, "assets/sprites/gameAnnouncements/suit_button_pass.png");
    this.load.image(constants.gameAnnouncementsBackground, "assets/sprites/gameAnnouncements/background.png");
  }

  create() {
    this.scene.start("LoadingBelot");
    var signalR = (this.plugins.get('signalR') as unknown as SignalRPlugin).Connection;
    signalR.invoke("AwaitGame");
  }
}

export default BootGameScene
