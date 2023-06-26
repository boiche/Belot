import { GameObjects } from "phaser";
import { constants, gameOptions, getScales } from "../../main";
import { Card } from "../GameObjects/Card";
import GameTableScene from "../scenes/game-table-scene";
import { SignalRPlugin } from "../scenes/main-scene";
import ShowOpponentCardRequest from "../server-api/requests/signalR/show-opponent-card-request";
import { GameAnnouncementType } from "./Announcement";

enum TypeDeal {
  FirstDeal,
  SecondDeal
}

/** This class is used for internal description of the dealt state and sorted state of player's hand */
class CurrentPlayerHand {
  sorted: Card[];
  initial: Card[];

  constructor(sorted: Card[], initial: Card[]) {
    this.sorted = sorted;
    this.initial = initial;
  }
}

class HandPositionOptions  {
  cardsOffset: number = 0;
  stepTiltAngle: number = 0;
  readonly sceneMiddlePoint = new Phaser.Geom.Point(window.innerWidth / 2, window.innerHeight / 2);
  get isMainPlayer(): boolean {
    return this.player === 0
  }
  player: 0 | 1 | 2 | 3 = 0;
  scales = getScales();

  readonly mainPlayerConfiguration = {
    allignFuncs: {
      x: (middleIndex: number, i: number, count: number) => { var evenOffset = count % 2 == 0 ? gameOptions.cardWidth * 10 / 24 : gameOptions.cardWidth / 4; return -this.cardsOffset * (middleIndex - i) - evenOffset },
      y3: (i: number, playerIndex: number) => this.threeAllignFunc(i, playerIndex),
      y5: (i: number, playerIndex: number) => this.fiveAllignFunc(i, playerIndex),
      y8: (i: number, playerIndex: number) => this.eightAllignFunc(i, playerIndex),
      rotate: (middleIndex: number, i: number) => 0 //- this.stepTiltAngle * (middleIndex - i)
    },
    initAngle: 0,    
    middlePoint: new Phaser.Geom.Point(window.innerWidth / 2, window.innerHeight - gameOptions.cardHeight / 1.5),
    goalPoint: new Phaser.Geom.Point(window.innerWidth / 2 - gameOptions.cardWidth / 4, window.innerHeight - gameOptions.cardHeight / 1.5),
    collectPoint: new Phaser.Geom.Point(window.innerWidth / 2 - gameOptions.cardWidth / 4, window.innerHeight)
  }
  readonly leftPlayerConfiguration = {
    allignFuncs: {
      x3: (i: number, playerIndex: number) => this.threeAllignFunc(i, playerIndex),
      x5: (i: number, playerIndex: number) => this.fiveAllignFunc(i, playerIndex),
      x8: (i: number, playerIndex: number) => this.eightAllignFunc(i, playerIndex),
      y: (middleIndex: number, i: number, count: number) => { var evenOffset = count % 2 == 0 ? gameOptions.cardWidth * 10 / 24 : gameOptions.cardWidth / 4; return -this.cardsOffset * (middleIndex - i) - evenOffset; },
      rotate: (middleIndex: number, i: number) => 270 //- this.stepTiltAngle * (middleIndex - i)
    },
    initAngle: 270,
    middlePoint: new Phaser.Geom.Point(gameOptions.cardWidth * 2.5, window.innerHeight / 2),
    goalPoint: new Phaser.Geom.Point(gameOptions.cardWidth * 2.5, window.innerHeight / 2 - gameOptions.cardWidth / 4),
    collectPoint: new Phaser.Geom.Point(0 - gameOptions.cardWidth / 2, window.innerHeight / 2 - gameOptions.cardHeight / 4)
  }
  readonly upPLayerConfiguration = {
    allignFuncs: {
      x: (middleIndex: number, i: number, count: number) => { var evenOffset = count % 2 == 0 ? gameOptions.cardWidth / 12 : gameOptions.cardWidth / 4; return -this.cardsOffset * (middleIndex - i) + evenOffset; },
      y3: (i: number, playerIndex: number) => this.threeAllignFunc(i, playerIndex),
      y5: (i: number, playerIndex: number) => this.fiveAllignFunc(i, playerIndex),
      y8: (i: number, playerIndex: number) => this.eightAllignFunc(i, playerIndex),
      rotate: (middleIndex: number, i: number) => 180 //+ this.stepTiltAngle * (middleIndex - i)
    },
    initAngle: 180,
    middlePoint: new Phaser.Geom.Point(window.innerWidth / 2, gameOptions.cardHeight / 1.5),
    goalPoint: new Phaser.Geom.Point(window.innerWidth / 2 + gameOptions.cardWidth / 4, gameOptions.cardHeight / 1.5),
    collectPoint: new Phaser.Geom.Point(window.innerWidth / 2 - gameOptions.cardWidth / 4, 0 - gameOptions.cardHeight / 2)
  }
  readonly rightPlayerConfiguration = {
    allignFuncs: {
      x3: (i: number, playerIndex: number) => this.threeAllignFunc(i, playerIndex),
      x5: (i: number, playerIndex: number) => this.fiveAllignFunc(i, playerIndex),
      x8: (i: number, playerIndex: number) => this.eightAllignFunc(i, playerIndex),
      y: (middleIndex: number, i: number, count: number) => { var evenOffset = count % 2 == 0 ? gameOptions.cardWidth * 10 / 24 : gameOptions.cardWidth / 4; return this.cardsOffset * (middleIndex - i) + evenOffset; },
      rotate: (middleIndex: number, i: number) => 90 //- this.stepTiltAngle * (middleIndex - i)
    },
    initAngle: 90,
    middlePoint: new Phaser.Geom.Point(window.innerWidth - gameOptions.cardWidth * 2.5, window.innerHeight / 2),
    goalPoint: new Phaser.Geom.Point(window.innerWidth - gameOptions.cardWidth * 2.5, window.innerHeight / 2 + gameOptions.cardWidth / 4),
    collectPoint: new Phaser.Geom.Point(window.innerWidth, window.innerHeight / 2 - gameOptions.cardHeight / 4)
  }

  readonly threeAllignFunc = (i: number, playerIndex: number): number => { var sign = playerIndex < 2 ? 1 : -1; return (3.75 * Math.pow(i, 2) - 7.5 * i + 3.75) * sign; };
  readonly fiveAllignFunc = (i: number, playerIndex: number): number => { var sign = playerIndex < 2 ? 1 : -1; return (3.75 * Math.pow(i, 2) - 15 * i + 15) * sign; };
  readonly eightAllignFunc = (i: number, playerIndex: number): number => { var sign = playerIndex < 2 ? 1 : -1; return (2.8125 * Math.pow(i, 2) - 19.6875 * i + 33.75) * sign; };

  setCardsOffset(offset: number) {
    this.cardsOffset = offset;
  }

  copy(this: HandPositionOptions): HandPositionOptions {
    var result = new HandPositionOptions();

    result.cardsOffset = this.cardsOffset;
    result.player = this.player;
    result.stepTiltAngle = this.stepTiltAngle;

    return result;
  }
}

class Dealer {
  cards: Card[] = [];
  backsGroups: Phaser.GameObjects.Group[] = [];
  _scene!: GameTableScene;
  _signalR!: SignalRPlugin;
  options: HandPositionOptions = new HandPositionOptions();
  firstDealReady = false;
  _dealtCards: any;
  secondDealReady = false;
  currentDeal!: 0 | 1;
  absoluteDealerIndex!: PlayerNumber;
  scales = getScales();
  _announcementsReady = false;

  public FirstDeal(dealerIndex: PlayerNumber) {
    this.options.setCardsOffset(gameOptions.cardWidth / 2);
    this.backsGroups = [];

    this.CreateBacks(5); 

    this.Deal(dealerIndex, 5, TypeDeal.FirstDeal);
  }

  public SecondDeal(dealerIndex: PlayerNumber) {
    this.options.setCardsOffset(gameOptions.cardWidth / 3);
    this.currentDeal = 1;

    this.CreateBacks(3);

    this.Deal(dealerIndex, 3, TypeDeal.SecondDeal);
  }

  async Deal(dealerIndex: PlayerNumber, count: number, typeDeal: TypeDeal) {
    this.options.player = dealerIndex;
    this.options.setCardsOffset(gameOptions.cardWidth / 3);

    await this._signalR.Connection.invoke("DealCards", {
      count: count,
      gameId: this._scene.gameId
    });

    var announcement = this?._scene?._belotGame?.currentAnnouncement?.type;
    var playerInfo = await this._signalR.Connection.getPlayer();    

    //currentPlayer comes as Object, not as Player -> sortPlayingHand is undefined
    var playerHandInfo = new CurrentPlayerHand(this._scene.currentPlayer.sortPlayingHand(playerInfo.playingHand, announcement ?? GameAnnouncementType.PASS), playerInfo.playingHand);
    

    for (var i = 0; i < playerHandInfo.sorted.length; i++) {
      var current = playerHandInfo.sorted[i];
      current.sprite = this._scene.add.sprite(0, 0, constants.cardsSpritesheet, current.frameIndex)
        .setVisible(false)
        .setOrigin(0)
        .setName("suit: " + current.suit + " rank: " + current.rank);
    }
    //this.initPlayers();

    this._scene.currentPlayer.playingHand = playerHandInfo.sorted.map(x => new Card(x.suit, x.rank, x.sprite));
    var timelineWholeDeal = this._scene.tweens.createTimeline();
    var currentPlayerIndex: number = dealerIndex >= 3 ? 0 : dealerIndex + 1;
    var goalPoints: Phaser.Geom.Point[] = [
      this.options.mainPlayerConfiguration.goalPoint,
      this.options.rightPlayerConfiguration.goalPoint,
      this.options.upPLayerConfiguration.goalPoint,
      this.options.leftPlayerConfiguration.goalPoint
    ];

    if (typeDeal === TypeDeal.FirstDeal) {
      for (var i = 0; i < 4; i++) {
        this.options.player = currentPlayerIndex as PlayerNumber;
        var playersBacks = this.backsGroups[currentPlayerIndex].getChildren().slice(0, 3) as GameObjects.Sprite[];

        timelineWholeDeal.add({
          targets: playersBacks,
          x: goalPoints[currentPlayerIndex].x,
          y: goalPoints[currentPlayerIndex].y,
          onStart: this.dealCard,
          ease: 'Sine.easeOut',
          delay: this._scene.tweens.stagger(100, {}),
          duration: 200,
          callbackContext: this._scene,
          onComplete: this.showCard,
          onCompleteParams: [this.options, playersBacks, this, currentPlayerIndex, playerHandInfo, dealerIndex],
        });
        currentPlayerIndex++;
        if (currentPlayerIndex > 3) {
          currentPlayerIndex = 0;
        }
      }

      for (var i = 0; i < 4; i++) {
        this.options.player = currentPlayerIndex as PlayerNumber;
        var playersBacks = this.backsGroups[currentPlayerIndex].getChildren() as GameObjects.Sprite[];

        timelineWholeDeal.add({
          targets: this.backsGroups[currentPlayerIndex].getChildren().slice(3, 5),
          x: goalPoints[currentPlayerIndex].x,
          y: goalPoints[currentPlayerIndex].y,
          onStart: this.dealCard,
          ease: 'Sine.easeOut',
          delay: this._scene.tweens.stagger(200, {}),
          duration: 200,
          callbackContext: this._scene,
          onComplete: this.showCard,
          onCompleteParams: [this.options, playersBacks, this, currentPlayerIndex, playerHandInfo, dealerIndex],
        });
        currentPlayerIndex++;
        if (currentPlayerIndex > 3) {
          currentPlayerIndex = 0;
        }              
      }
    }
    else {
      for (var i = 0; i < 4; i++) {
        this.options.player = currentPlayerIndex as PlayerNumber;
        var playersBacks = this.backsGroups[currentPlayerIndex].getChildren() as GameObjects.Sprite[];

        timelineWholeDeal.add({
          targets: this.backsGroups[currentPlayerIndex].getChildren().slice(5, 8),
          x: goalPoints[currentPlayerIndex].x,
          y: goalPoints[currentPlayerIndex].y,
          onStart: this.dealCard,
          ease: 'Sine.easeOut',
          delay: this._scene.tweens.stagger(200, {}),
          duration: 200,
          callbackContext: this._scene,
          onComplete: this.showCard,
          onCompleteParams: [this.options, playersBacks, this, currentPlayerIndex, playerHandInfo, dealerIndex],
        });
        currentPlayerIndex++;
        if (currentPlayerIndex > 3) {
          currentPlayerIndex = 0;
        }
      }      
    }

    timelineWholeDeal.play();    
  }

  CreateBacks(count: number) {
    if (this._scene.children.getByName("scene_middle") === null) {
      var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setName("scene_middle").setDepth(100);
      graphics.fillPointShape(new Phaser.Geom.Point(this.options.sceneMiddlePoint.x, this.options.sceneMiddlePoint.y), 10);
    }

    for (var j = 0; j < 4; j++) {
      var group, initLength = 0;

      if (this.backsGroups.length > j) {
        group = this.backsGroups[j];
        initLength = group.getLength();
      }
      else {
        group = this._scene.add.group();
        this.backsGroups.push(group);
      }

      for (var i = 0; i < count; i++) {
        var sprite = this._scene.add.sprite(0, 0, constants.cardBack, 0)
          .setVisible(false)
          .setName(constants.belotGameObjectName + constants.cardBack)
          .setDepth(2 + initLength + i)
          .setScale(this.scales.X, this.scales.Y)
          .setOrigin(0)          
          .setX(this.options.sceneMiddlePoint.x - gameOptions.cardWidth / 4)
          .setY(this.options.sceneMiddlePoint.y - gameOptions.cardHeight / 4);

        switch (j) {
          case 0: {
            sprite
              .setAngle(this.options.mainPlayerConfiguration.initAngle)
          } break;
          case 1: {
            sprite
              .setAngle(this.options.leftPlayerConfiguration.initAngle)
              .setX(sprite.x - (gameOptions.cardHeight - gameOptions.cardWidth) / 4)
              .setY(sprite.y + gameOptions.cardWidth / 2 + (gameOptions.cardHeight - gameOptions.cardWidth) / 4);
          } break;
          case 2: {
            sprite
              .setAngle(this.options.upPLayerConfiguration.initAngle)
              .setX(sprite.x + gameOptions.cardWidth / 2)
              .setY(sprite.y + gameOptions.cardHeight / 2);
          } break;
          case 3: {
            sprite
              .setAngle(this.options.rightPlayerConfiguration.initAngle)
              .setX(sprite.x + gameOptions.cardWidth / 2 + (gameOptions.cardHeight - gameOptions.cardWidth) / 4)
              .setY(sprite.y + (gameOptions.cardHeight - gameOptions.cardWidth) / 4);
          } break;
        }

        group.add(sprite);
      }      
    }
  }

  initPlayers() {
    this.options.stepTiltAngle = 5;

    var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
    graphics.fillPointShape(new Phaser.Geom.Point(this.options.mainPlayerConfiguration.goalPoint.x, this.options.mainPlayerConfiguration.goalPoint.y), 10);

    var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
    graphics.fillPointShape(new Phaser.Geom.Point(this.options.rightPlayerConfiguration.goalPoint.x, this.options.rightPlayerConfiguration.goalPoint.y), 10);

    var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
    graphics.fillPointShape(new Phaser.Geom.Point(this.options.upPLayerConfiguration.goalPoint.x, this.options.upPLayerConfiguration.goalPoint.y), 10);

    var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
    graphics.fillPointShape(new Phaser.Geom.Point(this.options.leftPlayerConfiguration.goalPoint.x, this.options.leftPlayerConfiguration.goalPoint.y), 10);
  }

  dealCard(tween: Phaser.Tweens.Tween, targets: Phaser.GameObjects.Sprite[]) {
    targets.forEach((x) => x
      .setVisible(true));
  }

  /**
 * Shows the dealt cards. Invoked on completion of the timeline of deal.
 */
  showCard(tween: Phaser.Tweens.Tween, targets: GameObjects.Sprite[], options: HandPositionOptions, backs: Phaser.GameObjects.Sprite[], dealer: Dealer, forPlayer: PlayerNumber, mainPlayerCards: CurrentPlayerHand, dealerIndex: number) {
    var middleIndex = Math.ceil(backs.length / 2) - 1, count = backs.length;
    var cardsToShow = dealer._scene.currentPlayer.getSortedIntersection(mainPlayerCards.initial.slice(0, count));

    for (var i = 0; i < count; i++) {
      var xOffset = 0, yOffset = 0, angle = 0, sprite = backs[i];      

      switch (forPlayer) {
        case 0: {
          xOffset = options.mainPlayerConfiguration.allignFuncs.x(middleIndex, i, count);
          if (count <= 3) {
            yOffset = options.mainPlayerConfiguration.allignFuncs.y3(i, forPlayer);
          }
          else if (count <= 5) {
            yOffset = options.mainPlayerConfiguration.allignFuncs.y5(i, forPlayer);
          }
          else {
            yOffset = options.mainPlayerConfiguration.allignFuncs.y8(i, forPlayer);
          }

          angle = options.mainPlayerConfiguration.allignFuncs.rotate(middleIndex, i);
          sprite.x = options.mainPlayerConfiguration.middlePoint.x + xOffset;
          sprite.y = options.mainPlayerConfiguration.middlePoint.y + yOffset;  
        } break;
        case 1: {
          if (count <= 3) {
            xOffset = options.rightPlayerConfiguration.allignFuncs.x3(i, forPlayer);
          }
          else if (count <= 5) {
            xOffset = options.rightPlayerConfiguration.allignFuncs.x5(i, forPlayer);
          }
          else {
            xOffset = options.rightPlayerConfiguration.allignFuncs.x8(i, forPlayer);
          }

          yOffset = options.rightPlayerConfiguration.allignFuncs.y(middleIndex, i, count);
          angle = options.rightPlayerConfiguration.allignFuncs.rotate(middleIndex, i);

          sprite.x = options.rightPlayerConfiguration.middlePoint.x + xOffset;
          sprite.y = options.rightPlayerConfiguration.middlePoint.y + yOffset;  
        } break;
        case 2: {
          xOffset = options.upPLayerConfiguration.allignFuncs.x(middleIndex, i, count);
          if (count <= 3) {
            yOffset = options.upPLayerConfiguration.allignFuncs.y3(i, forPlayer);
          }
          else if (count <= 5) {
            yOffset = options.upPLayerConfiguration.allignFuncs.y5(i, forPlayer);
          }
          else {
            yOffset = options.upPLayerConfiguration.allignFuncs.y8(i, forPlayer);
          }

          angle = options.upPLayerConfiguration.allignFuncs.rotate(middleIndex, i);
          sprite.x = options.upPLayerConfiguration.middlePoint.x + xOffset;
          sprite.y = options.upPLayerConfiguration.middlePoint.y + yOffset; 
        } break;
        case 3: {
          if (count <= 3) {
            xOffset = options.leftPlayerConfiguration.allignFuncs.x3(i, forPlayer);
          }
          else if (count <= 5) {
            xOffset = options.leftPlayerConfiguration.allignFuncs.x5(i, forPlayer);
          }
          else {
            xOffset = options.leftPlayerConfiguration.allignFuncs.x8(i, forPlayer);
          }

          yOffset = options.leftPlayerConfiguration.allignFuncs.y(middleIndex, i, count);
          angle = options.leftPlayerConfiguration.allignFuncs.rotate(middleIndex, i);
          sprite.x = options.leftPlayerConfiguration.middlePoint.x + xOffset;
          sprite.y = options.leftPlayerConfiguration.middlePoint.y + yOffset; 
        } break;
        default:
      }

      if (forPlayer === 0) {
        sprite
          .removeAllListeners()
          .setTexture(cardsToShow[i].sprite.texture.key, cardsToShow[i].sprite.frame.name)
          .setName(constants.belotGameObjectName + ' ' + cardsToShow[i].sprite.name)
          .setInteractive({ cursor: 'pointer' })
          .setData('suit', cardsToShow[i].suit)
          .setData('rank', cardsToShow[i].rank)
          .disableInteractive()
          .on('pointerover', function (this: GameObjects.Sprite, event: any) {
            this.y -= 15;
          })
          .on('pointerout', function (this: GameObjects.Sprite, event: any) {
            this.y += 15;
          })
          .on('pointerdown', function (this: GameObjects.Sprite, event: any) {
            var scene = (this.scene as GameTableScene);
            var isRightClick: boolean = false;
            event = event || window.event;

            if ('which' in event) {
              isRightClick = event.which === 3;
            }
            else if ('button' in event) {
              isRightClick = event.button === 2;
            }

            if (isRightClick) {
              this.setTint(6);
            }
            else {
              let request = new ShowOpponentCardRequest();
              request.gameId = scene.gameId;
              request.card = new Card(this.getData('suit') as number, this.getData('rank') as number, this);
              request.opponentConnectionId = scene.signalR.Connection.getConnectionId();

              scene.signalR.Connection.invoke("ThrowCard", request);
            }
          });

        // when count is less than 5 reorders the hand and duplicates object on intersection 
        if (count >= 5) {
          dealer._scene.currentPlayer.playingHand[i] = new Card(cardsToShow[i].suit, cardsToShow[i].rank, sprite);
        }        
      }
    }

    if (backs.length === 5 && forPlayer === dealerIndex) {      
      dealer.firstDealReady = true;

      if (dealer._announcementsReady) {
        dealer._scene.gameAnnouncements.show(); //TODO: this is ineffective implementation. Is it possible to show it via TurnManager?
      }

      if (dealer._scene.currentPlayer.playerIndex === dealer.absoluteDealerIndex) {
        dealer._signalR.Connection.invoke('FirstDealCompleted', dealer._scene.gameId);
      }        
    }
    if (backs.length === 8 && forPlayer === dealerIndex) {
      if (dealer._scene.currentPlayer.playerIndex === dealer.absoluteDealerIndex) {
        dealer._signalR.Connection.invoke('SecondDealCompleted', dealer._scene.gameId);
      } 
    } 
  }

  /**
 * Disables user's hand. Invoked on completion of throw.
 */
  disableCards() {
    console.log('disabling player cards');
    var toDisable = this._scene.children.getChildren().filter(x => x.name.startsWith(constants.belotGameObjectName + ' suit:'));
    toDisable.forEach(x => x.disableInteractive());
    if (this._scene.currentPlayer.isOnTurn) {
      this.enableCards();
    }
  }

  enableCards() {
    console.log('enabling player cards');
    var toEnable = this._scene.children.getChildren().filter(x => x.name.startsWith(constants.belotGameObjectName + ' suit:'));
    toEnable.forEach(x => x.setInteractive());
  }

  public throwCard(cardInfo: Card, playerRelativeIndex: PlayerNumber) {
    var sprite: GameObjects.Sprite;    

    switch (playerRelativeIndex) {
      case 0: {
        var card = this._scene.currentPlayer.playingHand.filter(x => x.equal(cardInfo))[0];
        var index = this._scene.currentPlayer.playingHand.indexOf(card);
        this._scene.currentPlayer.playingHand.splice(index, 1);
        sprite = this._scene.children.getByName(card.sprite.name) as GameObjects.Sprite;
      } break;
      case 1: {
        sprite = this._scene.add.sprite(
            this.options.rightPlayerConfiguration.middlePoint.x,
            this.options.rightPlayerConfiguration.middlePoint.y,
            constants.cardsSpritesheet,
            cardInfo.frameIndex)
          .setScale(this.scales.X, this.scales.Y);
      } break;
      case 2: {
        sprite = this._scene.add.sprite(
            this.options.upPLayerConfiguration.middlePoint.x,
            this.options.upPLayerConfiguration.middlePoint.y,
            constants.cardsSpritesheet,
            cardInfo.frameIndex)
          .setScale(this.scales.X, this.scales.Y);
      } break;
      case 3: {
        sprite = this._scene.add.sprite(
            this.options.leftPlayerConfiguration.middlePoint.x,
            this.options.leftPlayerConfiguration.middlePoint.y,
            constants.cardsSpritesheet,
            cardInfo.frameIndex)
          .setScale(this.scales.X, this.scales.Y);
      } break;
    }

    if (playerRelativeIndex !== 0) {
      this.backsGroups[playerRelativeIndex].remove(this.backsGroups[playerRelativeIndex].children.getArray()[0] as GameObjects.Sprite, true, true);
    }

    sprite.removeInteractive().removeAllListeners();
    sprite.setData('thrown', true);

    this._scene.add.tween({
      targets: [sprite],
      ease: "Quart.easeOut",
      x: this.options.sceneMiddlePoint.x - gameOptions.cardWidth / 2 * Math.random(),
      y: this.options.sceneMiddlePoint.y - gameOptions.cardHeight / 4 * Math.random(),
      onStart: playerRelativeIndex === 0 ? this.disableCards : undefined,
      callbackScope: this
    });
    this._scene.currentPlayer.isOnTurn = false;
  }

  collectCards(opponentRelativeIndex: PlayerNumber) {
    var collectPoint: Phaser.Geom.Point;

    var thrownCards = this._scene.children.getAll().filter(x => x.getData('thrown') === true) as GameObjects.Sprite[];
    console.log(thrownCards);

    switch (opponentRelativeIndex) {
      case 0: collectPoint = this.options.mainPlayerConfiguration.collectPoint; break;
      case 1: collectPoint = this.options.leftPlayerConfiguration.collectPoint; break;
      case 2: collectPoint = this.options.upPLayerConfiguration.collectPoint; break;
      case 3: collectPoint = this.options.rightPlayerConfiguration.collectPoint; break;      
    }

    this._scene.add.tween({
      targets: thrownCards,
      delay: 250,
      ease: 'Expo.easeOut',
      x: collectPoint.x,
      y: collectPoint.y,
      onComplete: this.clearCards
    });
  }

  clearCards(tween: Phaser.Tweens.Tween, targets: GameObjects.Sprite[]) {
    for (var i = 0; i < targets.length; i++) {
      targets[i].scene.children.remove(targets[i], true).removeAllListeners().removeInteractive();
    }
  }
}

export { Dealer, TypeDeal, HandPositionOptions }
