import { Scene } from "phaser";
import { constants, gameOptions } from "../../main";
import BelotGame from "../BelotEngine/BelotGame";

class BootGameScene extends Scene {
  constructor() {
    super("BootBelot");
  }

  preload() {    
    let frameConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: 223,
      frameHeight: 324
    };    

    let backgroundConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: window.innerWidth,
      frameHeight: window.innerHeight
    };

    //this.load.spritesheet("cards", "assets/sprites/cards_svg.png", frameConfig);
    this.load.spritesheet(constants.cardsSpritesheet, "assets/sprites/belot_spritesheet.png", frameConfig);
    this.load.image("background", "assets/sprites/Background.png");
    this.load.spritesheet("cardBack", "assets/sprites/back.png", frameConfig);
    this.load.image("tableCloth", "assets/sprites/table_cloth.png");
    //TODO: is it better to make all these images into spritesheet?
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
    this.load.image(constants.gameScoreBackground, "assets/sprites/gameScore/background.png");
    this.load.image(constants.optionsButton, "assets/sprites/options_button.png");

    this.load.image(constants.clubsGameAnnouncementElement, "assets/sprites/gameAnnouncements/announcementElements/clubs-removebg-preview.png");
    this.load.image(constants.diamondsGameAnnouncementElement, "assets/sprites/gameAnnouncements/announcementElements/diamonds-removebg-preview.png");
    this.load.image(constants.heartsGameAnnouncementElement, "assets/sprites/gameAnnouncements/announcementElements/hearts-removebg-preview.png");
    this.load.image(constants.spadesGameAnnouncementElement, "assets/sprites/gameAnnouncements/announcementElements/spades-removebg-preview.png");
    this.load.image(constants.noSuitGameAnnouncementElement, "assets/sprites/gameAnnouncements/announcementElements/no_suit-removebg-preview.png");
    this.load.image(constants.allSuitsGameAnnouncementElement, "assets/sprites/gameAnnouncements/announcementElements/all_suits-removebg-preview.png");
  }

  create(belotGame: BelotGame) {
    this.scene.start("LoadingBelot", belotGame);
  }
}

export default BootGameScene
