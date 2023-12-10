import { GameObjects, Geom, Scene } from "phaser";
import { constants, gameOptions, getBelotGameObjectName } from "../../main";
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
import HandAnnounementsRectangle from "../GameObjects/handAnnouncementsRectangle";
import OptionsPopUp from "../GameObjects/PopUps/OptionsPopUp";
import FinalScorePopUp from "../GameObjects/PopUps/FinalScorePopUp";
import Turn from "../GameObjects/Turn";
import { SignalRPlugin } from "./main-scene";
import ShowScoreResponse from "../server-api/responses/show-score-response";
import TotalScore from "../GameObjects/TotalScore";
import Sidebar from "../GameObjects/Sidebar";
import OptionsButton from "../GameObjects/Buttons/OptionsButton";
import BelotGameObject from "../GameObjects/BelotGameObject";

class GameTableScene extends Scene {
  _belotGame: BelotGame;
  dealer: Dealer;
  signalR!: SignalRPlugin;
  gameId: string = "";
  currentPlayer!: Player;
  
  //Belot objects
  optionsButton!: OptionsButton;
  totalScore!: TotalScore;
  gameAnnouncements!: GameAnnouncementsPopUp;
  optionsPopUp: OptionsPopUp;
  handAnnouncements!: HandAnnounementsRectangle;
  sidebars: Sidebar[] = [];

  constructor() {
    super('PlayBelot');
    this.dealer = new Dealer();
    this.optionsPopUp = new OptionsPopUp(this);
    this._belotGame = new BelotGame();
  }  

  create(gameId: any) {
    this.gameAnnouncements = new GameAnnouncementsPopUp(this, 9);    

    this.gameId = gameId;
    this._belotGame.id = gameId;
    this.signalR = this.plugins.get('signalR') as SignalRPlugin;
    this.gameAnnouncements.signalR = this.signalR;    

    this.signalR.Connection.on('DealNew', () => this.dealNew());
    this.signalR.Connection.on('UpdateClientAnnouncements', (newAnnouncement: GameAnnouncementType, relativeIndex: PlayerNumber) => {
      this.gameAnnouncements.disableAnnouncements(newAnnouncement);
      new AnnounceChatBubble(this, GameAnnouncementType[newAnnouncement]).show(relativeIndex);
      new AnnouncedElement(this, newAnnouncement).show(relativeIndex);
    });
    this.signalR.Connection.on('SecondDeal', (dealInfo: any) => {
      this.gameAnnouncements.hide();
      this._belotGame.currentAnnouncement = new GameAnnouncement(dealInfo, "");
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
    this.signalR.Connection.on('AnnounceHandAnnouncement', (handAnnouncement: HandAnnouncementType, relativeIndex: PlayerNumber) => new AnnounceChatBubble(this, HandAnnouncementType[handAnnouncement]).show(relativeIndex));
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
    this.dealer.Init(this);

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
    this.sidebars.push(new Sidebar(this, {
      name: getBelotGameObjectName(constants.gameObjectNames.leftSidebar),
      width: this.cameras.main.width * 0.15,
      mainColor: 0x630801,
      secondaryColor: 0xb18380,
      point: new Geom.Point(0, 0),
      orientation: 'left'
    }));
    this.sidebars.push(new Sidebar(this, {
      name: getBelotGameObjectName(constants.gameObjectNames.rightSidebar),
      width: this.cameras.main.width * 0.15,
      mainColor: 0x630801,
      secondaryColor: 0xb18380,
      point: new Geom.Point(this.cameras.main.width * 0.85, 0),
      orientation: 'right'
    }));

    this.sidebars.forEach(x => x.show());

    // totalScore
    var textStyleConfig: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#000000',
      fontStyle: 'bold',
      fontSize: '52'
    };
    let sidebarWidth = this.sidebars[0].width;
    let totalScoreWidth = sidebarWidth * 0.8;
    let offset = (sidebarWidth - totalScoreWidth) / 2;
    console.log("width " + totalScoreWidth);
    this.totalScore = new TotalScore(this, {
      name: getBelotGameObjectName(constants.gameObjectNames.totalScore),
      fontStyle: textStyleConfig,
      width: totalScoreWidth,
      originPoint: new Geom.Point(offset, offset),      
    })

    this.totalScore.show();

    //option button
    let sidebar = BelotGameObject.getByName(getBelotGameObjectName(constants.gameObjectNames.rightSidebar)) as Sidebar;
    this.optionsButton = new OptionsButton(this, {
      name: getBelotGameObjectName(constants.gameObjectNames.optionsButton),
      originPoint: new Geom.Point(sidebar.originPoint.x + offset, sidebar.originPoint.y + offset),
      hoverColor: 0xD3DCE5,
      width: totalScoreWidth, //TODO: thick black line decenters the objects within the sidebars
      height: totalScoreWidth / 3.86
    })
    this.optionsButton.show();

    //hand announcements
    this.handAnnouncements = new HandAnnounementsRectangle(this, {
      name: getBelotGameObjectName(constants.gameObjectNames.handAnnouncement),
      fillColor: 0xFFFFFF,
      hoverColor: 0xD3DCE5,
      height: totalScoreWidth,
      width: totalScoreWidth,
      originPoint: new Geom.Point(sidebar.originPoint.x + offset, this.cameras.main.height - totalScoreWidth - offset)
    });
    this.handAnnouncements.show(this.sidebars[1].originPoint);
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
