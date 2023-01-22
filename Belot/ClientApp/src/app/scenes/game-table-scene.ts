import { GameObjects, Scene } from "phaser";
import { constants, gameOptions } from "../../main";
import { GameAnnouncementType } from "../BelotEngine/Announcement";
import BelotGame from "../BelotEngine/BelotGame";
import { Dealer, TypeDeal } from "../BelotEngine/Dealer";
import GameScore from "../BelotEngine/GameScore";
import Player from "../BelotEngine/Player";
import { TurnManager, TurnCodes } from "../BelotEngine/TurnManager";
import Card from "../GameObjects/Card";
import GameAnnouncementsPopUp from "../GameObjects/GameAnnouncementsPopUp";
import GameScorePopUp from "../GameObjects/GameScorePopUp";
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
  totalGameScoreOriginPoint!: Phaser.Geom.Point;

  constructor() {
    super('PlayBelot');
    this.dealer = new Dealer();
    this.gameAnnouncements = new GameAnnouncementsPopUp(this, 9);
    this._belotGame = new BelotGame();
  }  

  create(gameId: any) {
    var tempScore = new GameScore();
    tempScore.lastGameTeamA = 14;
    tempScore.lastGameTeamB = 12;

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
    this.signalR.Connection.on('ShowScore', (score: GameScore) => {
      var popup = new GameScorePopUp(this, score, 10);
      popup.show();

      this.updateTotalScore(score);
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
        console.log(player);
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

    // totalScore
    var config: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#000000',
      fontStyle: 'bold',
      fontSize: '52'
    };

    sidebarGraphics.fillStyle(0xd2b14c, 1);
    var rectangle = new Phaser.Geom.Rectangle(30, 30, sidebarWidth - 60, 200);
    sidebarGraphics.fillRectShape(rectangle);

    sidebarGraphics.lineStyle(5, 0x00000, 1);
    sidebarGraphics.strokeLineShape(rectangle.getLineA());
    sidebarGraphics.strokeLineShape(rectangle.getLineB());
    sidebarGraphics.strokeLineShape(rectangle.getLineC());
    sidebarGraphics.strokeLineShape(rectangle.getLineD());

    var weLabel = this.add.text(rectangle.x + 20, rectangle.y + 20, 'WE', config)
      .setName(constants.gameScoreTotalItem + 'weLabel')
      .setDepth(10)
      .setFontSize(42);

    var youLabel = this.add.text(weLabel.x + weLabel.width + 20, weLabel.y, 'YOU', config)
      .setName(constants.gameScoreTotalItem + ' youLabel')
      .setDepth(10)
      .setFontSize(42);

    this.add.text(weLabel.x, weLabel.y + weLabel.height + 15, '0', config)
      .setName(constants.gameScoreTotalItem + ' weScoreLabel')
      .setDepth(10)
      .setFontSize(42);

    this.add.text(youLabel.x, youLabel.y + youLabel.height + 15, '0', config)
      .setName(constants.gameScoreTotalItem + ' youScoreLabel')
      .setDepth(10)
      .setFontSize(42);

    this.totalGameScoreOriginPoint = new Phaser.Geom.Point(rectangle.x, rectangle.y);
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

  updateTotalScore(score: any) {
    var weScoreLabel = this.children.getByName(constants.gameScoreTotalItem + ' weScoreLabel') as GameObjects.Text;
    var youScoreLabel = this.children.getByName(constants.gameScoreTotalItem + ' youScoreLabel') as GameObjects.Text;

    var weScore = this.currentPlayer.team == 0 ? score.score.teamA.toString() : score.score.teamB.toString();
    var youScore = this.currentPlayer.team == 0 ? score.score.teamB.toString() : score.score.teamA.toString();

    weScoreLabel.text = weScore;
    youScoreLabel.text = youScore;
  }
}

export default GameTableScene
