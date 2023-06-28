import { GameObjects, Geom, Scene } from "phaser";
import { constants, gameOptions } from "../../main";
import { GameAnnouncement, GameAnnouncementType, HandAnnouncementType } from "../BelotEngine/Announcement";
import BelotGame from "../BelotEngine/BelotGame";
import { Dealer, TypeDeal } from "../BelotEngine/Dealer";
import GameScore from "../BelotEngine/GameScore";
import Player from "../BelotEngine/Player";
import { TurnManager, TurnCodes } from "../BelotEngine/TurnManager";
import AnnounceChatBubble from "../GameObjects/AnnounceChatBubble";
import AnnouncedElement from "../GameObjects/AnnouncedElement";
import GameAnnouncementsPopUp from "../GameObjects/PopUps/GameAnnouncementsPopUp";
import GameScorePopUp from "../GameObjects/PopUps/GameScorePopUp";
import HandAnnounementsRectangle from "../GameObjects/HandAnnouncementsRectangle";
import OptionsPopUp from "../GameObjects/PopUps/OptionsPopUp";
import FinalScorePopUp from "../GameObjects/PopUps/FinalScorePopUp";
import Turn from "../GameObjects/Turn";
import { SignalRPlugin } from "./main-scene";
import ShowScoreResponse from "../server-api/responses/show-score-response";

class GameTableScene extends Scene {
  center: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0);
  _belotGame: BelotGame;
  dealer: Dealer;
  gameAnnouncements!: GameAnnouncementsPopUp;
  optionsPopUp: OptionsPopUp;
  handAnnouncements!: HandAnnounementsRectangle;
  signalR!: SignalRPlugin;
  gameId: string = "";
  currentPlayer!: Player;
  totalGameScoreOriginPoint!: Phaser.Geom.Point;

  constructor() {
    super('PlayBelot');
    this.dealer = new Dealer();
    this.optionsPopUp = new OptionsPopUp(this);
    this._belotGame = new BelotGame();
  }  

  create(gameId: any) {
    this.gameAnnouncements = new GameAnnouncementsPopUp(this, 9);
    this.handAnnouncements = new HandAnnounementsRectangle(this);
    var tempScore = new GameScore();
    tempScore.lastGameTeamA = 14;
    tempScore.lastGameTeamB = 12;

    this.gameId = gameId;
    this._belotGame.gameId = gameId;
    this.signalR = this.plugins.get('signalR') as SignalRPlugin;
    this.gameAnnouncements.signalR = this.signalR;
    this.dealer.Init(this);

    this.signalR.Connection.on('DealNew', () => this.dealNew());
    this.signalR.Connection.on('UpdateClientAnnouncements', (newAnnouncement: GameAnnouncementType, relativeIndex: PlayerNumber) => {
      this.gameAnnouncements.disableAnnouncements(newAnnouncement);
      new AnnounceChatBubble(this, GameAnnouncementType[newAnnouncement]).showBubble(relativeIndex);
      new AnnouncedElement(this, newAnnouncement).showElement(relativeIndex);
    });
    this.signalR.Connection.on('SecondDeal', (dealInfo: any) => {
      this.gameAnnouncements.hide();
      this._belotGame.currentAnnouncement = new GameAnnouncement(dealInfo);
      this.deal(TypeDeal.SecondDeal);      
    });
    this.signalR.Connection.on('OnTurn', (turnInfo: Turn) => {
      try {
        var turnManager = new TurnManager(this.dealer, this.gameAnnouncements);

        switch (turnInfo.turnCode) {
          case TurnCodes.Announcement: turnManager.announce(); break;
          case TurnCodes.ThrowCard: turnManager.beforeThrow(); break;
        }
      } catch (e) {
        console.error(e);
      }      
    });
    this.signalR.Connection.on('ShowOpponentCard', (cardInfo: any) => {
      this.dealer.throwCard(cardInfo.card, cardInfo.opponentRelativeIndex);
    });
    this.signalR.Connection.on('CollectCards', (collectCardsInfo: any) => {
      this.dealer.collectCards(collectCardsInfo.opponentRelativeIndex);
    });
    this.signalR.Connection.on('ShowScore', (response: ShowScoreResponse) => {     
      var popup = new GameScorePopUp(this, response.score, 10);
      popup.show();

      this.updateTotalScore(response.score);

      if (!response.isGameOver) {
        setTimeout(() => this.dealNew(), 15000);
      }
      else {        
        setTimeout(() => {
          this.clearScene();
          this.signalR.Connection.invoke("GameOver", this.gameId);
        }, popup.visibleDuration);
      }
    });
    this.signalR.Connection.on('ShowHandAnnouncements', () => this.dealer._scene.handAnnouncements.showHandAnnouncements());
    this.signalR.Connection.on('AnnounceHandAnnouncement', (handAnnouncement: HandAnnouncementType, relativeIndex: PlayerNumber) => new AnnounceChatBubble(this, HandAnnouncementType[handAnnouncement]).showBubble(relativeIndex));
    this.signalR.Connection.on('ShowWinning', (score: GameScore) => {
      var popup = new FinalScorePopUp(this, score, 10, true);
      popup.show();

      setTimeout(() => location.reload(), 5000);
    });
    this.signalR.Connection.on('ShowLosing', (score: GameScore) => {
      var popup = new FinalScorePopUp(this, score, 10, false);
      popup.show();

      setTimeout(() => location.reload(), 5000);
    })


    var image = this.add.image(0, 0, "tableCloth")
      .setDepth(-1)
      .setOrigin(0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
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
      
      await scene.signalR.Connection.getPlayer().then((player) => {
        console.log(player);
        scene.currentPlayer = new Player(player.username, player.playerIndex, player.team);
      });

      scene.deal(TypeDeal.FirstDeal);
    });    
    this.cameras.main.fadeIn(1500);
  }

  drawSidebars() {
    var sidebarGraphics = this.add.graphics();
    var sidebarWidth = this.dealer.options.leftPlayerConfiguration.middlePoint.x - gameOptions.cardHeight / 2 - 65;
    var rightSidebarPoint: Geom.Point = new Geom.Point(this.dealer.options.rightPlayerConfiguration.middlePoint.x + gameOptions.cardHeight / 2 + 65, 0);

    var mainColor = 0x630801;
    var secondaryColor = 0xb18380;

    sidebarGraphics.fillGradientStyle(mainColor, secondaryColor, mainColor, secondaryColor, 1);
    sidebarGraphics.fillRect(0, 0, sidebarWidth, this.cameras.main.height);

    sidebarGraphics.lineStyle(10, 0x00000, 1);
    sidebarGraphics.lineBetween(sidebarWidth, 0, sidebarWidth, this.cameras.main.height);

    sidebarGraphics.fillGradientStyle(secondaryColor, mainColor, secondaryColor, mainColor, 1);
    sidebarGraphics.fillRect(rightSidebarPoint.x, rightSidebarPoint.y, sidebarWidth, this.cameras.main.height);

    sidebarGraphics.lineStyle(10, 0x00000, 1);
    sidebarGraphics.lineBetween(rightSidebarPoint.x, rightSidebarPoint.y, this.dealer.options.rightPlayerConfiguration.middlePoint.x + gameOptions.cardHeight / 2 + 65, this.cameras.main.height);

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

    //option button
    this.add.image(rightSidebarPoint.x + 30, rightSidebarPoint.y + 30, constants.optionsButton)
      .setScale(0.5, 0.5)
      .setOrigin(0, 0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerover', function (this: GameObjects.Sprite, event: any) { this.setTint(gameOptions.hoverColor); this.input.cursor = 'hand'; })
      .on('pointerout', function (this: GameObjects.Sprite, event: any) { this.clearTint(); this.input.cursor = 'pointer'; })
      .on('pointerdown', function (this: GameObjects.Sprite, event: any) {
        var scene = (this.scene as GameTableScene);

        scene.optionsPopUp.show();
      });

    this.handAnnouncements.draw(rightSidebarPoint);
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

  updateTotalScore(score: GameScore) {
    var weScoreLabel = this.children.getByName(constants.gameScoreTotalItem + ' weScoreLabel') as GameObjects.Text;
    var youScoreLabel = this.children.getByName(constants.gameScoreTotalItem + ' youScoreLabel') as GameObjects.Text;

    var weScore = this.currentPlayer.team == 0 ? score.teamA.toString() : score.teamB.toString();
    var youScore = this.currentPlayer.team == 0 ? score.teamB.toString() : score.teamA.toString();

    weScoreLabel.text = weScore;
    youScoreLabel.text = youScore;
  }
}

export default GameTableScene
