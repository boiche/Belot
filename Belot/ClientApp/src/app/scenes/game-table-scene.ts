import { GameObjects, Scene } from "phaser";
import { constants } from "../../main";
import { GameAnnouncement, GameAnnouncementType } from "../BelotEngine/Announcement";
import BelotGame from "../BelotEngine/BelotGame";
import Dealer from "../BelotEngine/Dealer";
import Player from "../BelotEngine/Player";
import GameAnnouncementsPopUp from "../GameObjects/GameAnnouncementsPopUp";
import { SignalRPlugin } from "./main-scene";

class GameTableScene extends Scene {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  center: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0);
  _belotGame: BelotGame;
  dealer: Dealer;
  gameAnnouncements: GameAnnouncementsPopUp;
  signalR!: SignalRPlugin;
  gameId: string = "";
  currentPlayer!: Player;

  constructor() {
    super('PlayBelot');
    this.dealer = new Dealer();
    this.gameAnnouncements = new GameAnnouncementsPopUp(this, 9);
    this._belotGame = new BelotGame();
  }  

  create(gameId: any) {
    this.gameId = gameId;
    this._belotGame.gameId = gameId;
    this.signalR = this.plugins.get('signalR') as SignalRPlugin;
    this.gameAnnouncements.signalR = this.signalR;
    this.dealer._scene = this;
    this.dealer._signalR = this.signalR;

    this.signalR.Connection.on("DealNew", () => this.dealNew());
    this.signalR.Connection.on("RefreshPlayer", async () => {
      console.log("(Before update) Player with index " + this.currentPlayer.playerIndex + " is on turn " + this.currentPlayer.isOnTurn);
      await this.signalR.Connection.getPlayer().then((player) => {
        this.currentPlayer = player;
      })
      console.log("(After update) Player with index " + this.currentPlayer.playerIndex + " is on turn " + this.currentPlayer.isOnTurn);
    });

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

    this.cameras.main.once('camerafadeincomplete', async function (camera: Phaser.Cameras.Scene2D.Camera) {
      var scene = (camera.scene as GameTableScene);
      scene.deal();
      await scene.signalR.Connection.getPlayer().then((player) => {
        scene.currentPlayer = player;
      })
    });    
    this.cameras.main.fadeIn(1500);
  }

  update() {
    if (this.dealer.firstDealReady) {
      if (this.currentPlayer.isOnTurn) {
        this.gameAnnouncements.show();
      }
      else {
        this.gameAnnouncements.hide();
      }
    }
  }

  deal() {
    this.signalR.Connection.invoke('GetGameInfo', this.gameId).then((info: any) => {
      this._belotGame.dealerIndex = info.dealerPlayer as PlayerNumber;
      this.dealer.FirstDeal(info.dealerPlayer);
    });     
  }  
  
  dealNew() {
    this.clearScene();
    this.deal();
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

    switch (announcement) {
      case constants.clubGameAnnouncement: this._belotGame.currentAnnouncement = new GameAnnouncement(GameAnnouncementType.CLUBS); break;
      case constants.diamondsGameAnnouncement: this._belotGame.currentAnnouncement = new GameAnnouncement(GameAnnouncementType.DIAMONDS); break;
      case constants.heartsGameAnnouncement: this._belotGame.currentAnnouncement = new GameAnnouncement(GameAnnouncementType.HEARTS); break;
      case constants.spadesGameAnnouncement: this._belotGame.currentAnnouncement = new GameAnnouncement(GameAnnouncementType.SPADES); break;
      case constants.noSuitGameAnnouncement: this._belotGame.currentAnnouncement = new GameAnnouncement(GameAnnouncementType.NOSUIT); break;
      case constants.allSuitsGameAnnouncement: this._belotGame.currentAnnouncement = new GameAnnouncement(GameAnnouncementType.ALLSUITS); break;
      case constants.doubleGameAnnouncement: this._belotGame.counterAnnouncement = new GameAnnouncement(GameAnnouncementType.COUNTER); break;
      case constants.redoubleGameAnnouncement: this._belotGame.counterAnnouncement = new GameAnnouncement(GameAnnouncementType.RECOUNTER); break;      
    }

    this.dealer.SecondDeal(this._belotGame.dealerIndex);
  }
}

export default GameTableScene
