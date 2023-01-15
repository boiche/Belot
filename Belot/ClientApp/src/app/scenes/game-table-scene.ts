import { GameObjects, Scene } from "phaser";
import { constants, gameOptions } from "../../main";
import { GameAnnouncementType } from "../BelotEngine/Announcement";
import BelotGame from "../BelotEngine/BelotGame";
import { Dealer, TypeDeal } from "../BelotEngine/Dealer";
import Player from "../BelotEngine/Player";
import { TurnManager, TurnCodes } from "../BelotEngine/TurnManager";
import Card from "../GameObjects/Card";
import GameAnnouncementsPopUp from "../GameObjects/GameAnnouncementsPopUp";
import Turn from "../GameObjects/Turn";
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

    this.signalR.Connection.on('DealNew', () => this.dealNew());
    this.signalR.Connection.on('UpdateClientAnnouncements', (newAnnouncement: GameAnnouncementType) => this.gameAnnouncements.updateAnnouncements(newAnnouncement));
    this.signalR.Connection.on('SecondDeal', () => {
      this.gameAnnouncements.hide();
      this.deal(TypeDeal.SecondDeal);
    });
    this.signalR.Connection.on('OnTurn', (turnInfo: Turn) => {      
      var turnManager = new TurnManager(this.dealer, this.gameAnnouncements);

      switch (turnInfo.turnCode) {
        case TurnCodes.Announcement: turnManager.announce(); break;
        case TurnCodes.ThrowCard: {
          turnManager.beforeThrow();
        } break;
      }
    });
    this.signalR.Connection.on('ShowOpponentCard', (cardInfo: any) => {
      this.dealer.throwCard(cardInfo.card, cardInfo.opponentRelativeIndex);
    });
    this.signalR.Connection.on('CollectCards', (collectCardsInfo: any) => {
      this.dealer.collectCards(collectCardsInfo.opponentRelativeIndex);
    });
    this.signalR.Connection.on("ShowScore", (score) => {
      console.log('showing score');
      console.log(score);
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

    this.drawSidebars();

    this.cameras.main.once('camerafadeincomplete', async function (camera: Phaser.Cameras.Scene2D.Camera) {
      var scene = (camera.scene as GameTableScene);

      scene.deal(TypeDeal.FirstDeal);
      await scene.signalR.Connection.getPlayer().then((player) => {
        scene.currentPlayer = player;
      })
    });    
    this.cameras.main.fadeIn(1500);
  }

  drawSidebars() {
    var sidebarGraphics = this.add.graphics();
    var sidebarWidth = this.dealer.options.leftPlayerConfiguration.middlePoint.x - gameOptions.cardHeight / 2 - 65;

    var mainColor = 0x630801;
    var secondaryColor = 0xb18380;

    sidebarGraphics.fillGradientStyle(mainColor, secondaryColor, mainColor, secondaryColor, 1);
    sidebarGraphics.fillRect(0, 0, sidebarWidth, window.innerHeight);

    sidebarGraphics.lineStyle(10, 0x00000, 1);
    sidebarGraphics.lineBetween(sidebarWidth, 0, sidebarWidth, window.innerHeight);

    sidebarGraphics.fillGradientStyle(secondaryColor, mainColor, secondaryColor, mainColor, 1);
    sidebarGraphics.fillRect(this.dealer.options.rightPlayerConfiguration.middlePoint.x + gameOptions.cardHeight / 2 + 65, 0, sidebarWidth, window.innerHeight);

    sidebarGraphics.lineStyle(10, 0x00000, 1);
    sidebarGraphics.lineBetween(this.dealer.options.rightPlayerConfiguration.middlePoint.x + gameOptions.cardHeight / 2 + 65, 0, this.dealer.options.rightPlayerConfiguration.middlePoint.x + gameOptions.cardHeight / 2 + 65, window.innerHeight);

    sidebarGraphics.fillStyle(0xd2b14c, 1);
    var rectangle = new Phaser.Geom.Rectangle(30, 30, sidebarWidth - 60, 200);
    sidebarGraphics.fillRectShape(rectangle);

    sidebarGraphics.lineStyle(5, 0x00000, 1);
    sidebarGraphics.strokeLineShape(rectangle.getLineA());
    sidebarGraphics.strokeLineShape(rectangle.getLineB());
    sidebarGraphics.strokeLineShape(rectangle.getLineC());
    sidebarGraphics.strokeLineShape(rectangle.getLineD());
  }

  deal(deal: TypeDeal) {
    this.signalR.Connection.invoke('GetGameInfo', this.gameId).then((info: any) => {
      this._belotGame.dealerIndex = info.dealerPlayerRealtive as PlayerNumber;
      this.dealer.absoluteDealerIndex = info.dealerPlayer as PlayerNumber;      
      switch (deal) {
        case TypeDeal.FirstDeal: this.dealer.FirstDeal(info.dealerPlayerRealtive); break;
        case TypeDeal.SecondDeal: this.dealer.SecondDeal(info.dealerPlayerRealtive); break;
        default: throw ('Not supported type of deal');
      }
    });     
  }  
  
  dealNew() {
    console.log('dealing new...');

    this.clearScene();

    this.gameAnnouncements.reset();
    this.currentPlayer.playingHand = [];

    this.deal(TypeDeal.FirstDeal);
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
}

export default GameTableScene
