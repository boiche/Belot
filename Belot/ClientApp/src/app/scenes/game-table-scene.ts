import { GameObjects, Scene } from "phaser";
import { constants } from "../../main";
import Dealer from "../BelotEngine/Dealer";
import GameAnnouncementsPopUp from "../GameObjects/GameAnnouncementsPopUp";
import { SignalRPlugin } from "./main-scene";

class GameTableScene extends Scene {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  center: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0);
  dealer: Dealer;
  gameAnnouncements: GameAnnouncementsPopUp;
  signalR!: SignalRPlugin;
  gameId: string = "";

  constructor() {
    super('PlayBelot');
    this.dealer = new Dealer();
    this.gameAnnouncements = new GameAnnouncementsPopUp(this, 9);    
  }  

  create(gameId: any) {
    this.gameId = gameId;
    this.signalR = this.plugins.get('signalR') as SignalRPlugin;
    this.dealer._scene = this;
    this.dealer._signalR = this.signalR;

    var image = this.add.image(0, 0, "tableCloth")
      .setDepth(-1)
      .setOrigin(0)
      .setDisplaySize(this.windowWidth, this.windowHeight)
      .setVisible(true)
      .setName('tableCloth');

    this.tweens.add({
      targets: image,
      x: 0,      
      ease: Phaser.Math.Easing.Sine.Out,
      yoyo: false,
      duration: 1000
    });       

    this.cameras.main.once('camerafadeincomplete', function (camera: Phaser.Cameras.Scene2D.Camera) {
      var scene = (camera.scene as GameTableScene);

      // place players

      scene.signalR.Connection.invoke('GetGameInfo', gameId).then((info: any) => {
        scene.deal(info.dealerPlayer);
      });      
    });    
    this.cameras.main.fadeIn(1500);
  }

  update() {
    if (this.dealer.firstDealReady) {
      console.log('ready');      
      this.dealer.firstDealReady = false;
      this.gameAnnouncements.show();
    }
  }

  deal(playerNumber: PlayerNumber) {
    this.dealer.FirstDeal(playerNumber);
  }  
  
  dealNew() {
    this.clearScene();
    this.deal(0);
  }

  clearScene() {
    var toRemove = this.children.getChildren().filter((sprite) => sprite.name.startsWith(constants.belotGameObjectName, 0)) as GameObjects.Sprite[];
    for (var i = 0; i < toRemove.length; i++) {
      toRemove[i]
        .removeInteractive()
        .removeAllListeners();
      this.children.remove(toRemove[i], false);      
    }
  }

  announce(announcement: string) {
    this.gameAnnouncements.hide();

    //switch (announcement) {
    //  case constants.clubGameAnnouncement: this._belotGame.currentAnnounce = new GameAnnouncement(GameAnnouncementType.CLUBS); break;
    //  case constants.diamondsGameAnnouncement: this._belotGame.currentAnnounce = new GameAnnouncement(GameAnnouncementType.DIAMONDS); break;
    //  case constants.heartsGameAnnouncement: this._belotGame.currentAnnounce = new GameAnnouncement(GameAnnouncementType.HEARTS); break;
    //  case constants.spadesGameAnnouncement: this._belotGame.currentAnnounce = new GameAnnouncement(GameAnnouncementType.SPADES); break;
    //  case constants.noSuitGameAnnouncement: this._belotGame.currentAnnounce = new GameAnnouncement(GameAnnouncementType.NOSUIT); break;
    //  case constants.allSuitsGameAnnouncement: this._belotGame.currentAnnounce = new GameAnnouncement(GameAnnouncementType.ALLSUITS); break;
    //  case constants.doubleGameAnnouncement: this._belotGame.counter = new GameAnnouncement(GameAnnouncementType.COUNTER); break;
    //  case constants.redoubleGameAnnouncement: this._belotGame.counter = new GameAnnouncement(GameAnnouncementType.RECOUNTER); break;      
    //}

    //this.dealer.SecondDeal();
  }
}

export default GameTableScene
