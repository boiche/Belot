import { Game, GameObjects } from "phaser";
import { gameOptions } from "../../main";
import Card from "../GameObjects/Card";
import Utils from "./utils";

class HandPositionOptions {
  middlePoint: Phaser.Geom.Point = new Phaser.Geom.Point();
  lowerBoundOffset: number = 0;
  upperBoundOffset: number = 0;
  cardsOffset: number = 0;
  allignFunc!: (x: number) => number;
  initTiltAngleRadians: number = 0;
  stepTiltAngleRadians: number = 0;
  readonly sceneMiddlePoint = new Phaser.Geom.Point(window.innerWidth / 2, window.innerHeight / 2);
  isMainPlayer: boolean = false;

  threeAllignFunc = (i: number): number => { return 3.75 * Math.pow(i, 2) - 7.5 * i + 3.75; };
  //fourAllignFunc = (i: number): number => { return 0; };
  fiveAllignFunc = (i: number): number => { return 3.75 * Math.pow(i, 2) - 15 * i + 15; };
  //sixAllignFunc = (i: number): number => { return 0; };
  sevenAllignFunc = (i: number): number => { return 0; };

  setMiddlePoint(x: number, y: number) {
    this.middlePoint = new Phaser.Geom.Point(x, y);
    this.lowerBoundOffset = window.innerHeight - y;
  }

  setCardsOffset(offset: number) {
    this.cardsOffset = offset;
  }
}

class Dealer {
  static dealer: 0 | 1 | 2 | 3;
  static cards: Card[] = [];
  static backsGroups: Phaser.GameObjects.Group[] = [];
  static _scene: Phaser.Scene;
  static options: HandPositionOptions = new HandPositionOptions();
  static _dealtCards: Card[] = [];
  static paths: Phaser.Curves.Path[] = [];
  static awaitPreviousCard = false;


  public static setDealer(playerNumber: 0 | 1 | 2 | 3) {
    this.dealer = playerNumber;
  }

  //TODO: sync operations and separate 3-deal and 2-deal. Refactor algorithm for allign hand (make it allign any quantity of cards in center)
  public static FirstDeal() {
    this.options.setCardsOffset(gameOptions.cardWidth / 2);
    this.options.allignFunc = this.options.threeAllignFunc;

    this.CreateBacks(4);
    this._dealtCards = [];
    this.Deal(2, 0);
    this.Deal(2, 1);
    this.Deal(2, 2);
    this.Deal(2, 3);

    this._scene.update(Date.now(), 0);

    this.options.allignFunc = this.options.fiveAllignFunc;
  }

  static Deal(endIndex: number, playerNumber: PlayerNumber) {
    var middleIndex = Math.ceil(endIndex / 2);

    switch (endIndex) {
      case 1:
      case 2: {
        this.options.allignFunc = this.options.threeAllignFunc;
      } break;
      case 3:
      case 4: {
        this.options.allignFunc = this.options.fiveAllignFunc;
      } break;
      case 5:
      case 6:
      case 7: {
        this.options.allignFunc = this.options.sevenAllignFunc;
      } break;
      default:
    }

    switch (playerNumber) {
      case 0: {
        this.options.setMiddlePoint(window.innerWidth / 2, window.innerHeight - gameOptions.cardHeight / 1.5);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.initTiltAngleRadians = 6.2831853072; //360 deg
        this.options.stepTiltAngleRadians = 0.1745329252 / (endIndex - middleIndex); //20 deg
        this.options.isMainPlayer = true;
        this.ArrangeMainPlayer(endIndex);

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 1: {
        this.options.setMiddlePoint(gameOptions.cardWidth * 2.5, window.innerHeight / 2);
        this.options.setCardsOffset(gameOptions.cardWidth / 2);
        this.options.initTiltAngleRadians = 1.5707963268; //360 deg
        this.options.stepTiltAngleRadians = 0.1745329252 / (endIndex - middleIndex); //20 deg
        this.options.isMainPlayer = false;
        this.ArrangeLeftPlayer(endIndex);

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 2: {
        this.options.setMiddlePoint(window.innerWidth / 2, gameOptions.cardHeight / 1.5);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.initTiltAngleRadians = 3.1415926536; //180 deg
        this.options.stepTiltAngleRadians = 0.1745329252 / (endIndex - middleIndex); //20 deg
        this.options.isMainPlayer = false;
        this.ArrangeUpPlayer(endIndex);

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 3: {
        this.options.setMiddlePoint(window.innerWidth - gameOptions.cardWidth * 2.5, window.innerHeight / 2);
        this.options.setCardsOffset(gameOptions.cardWidth / 2);
        this.options.initTiltAngleRadians = 4.7123889804; //270 deg
        this.options.stepTiltAngleRadians = 0.1745329252 / (endIndex - middleIndex); //20 deg
        this.options.isMainPlayer = false;
        this.ArrangeRightPlayer(endIndex);

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
    }
  }

  static CreateBacks(endIndex: number) {
    this.options.setMiddlePoint(window.innerWidth / 2, window.innerHeight / 2);

    if (this._scene.children.getByName("scene_middle") === null) {
      var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setName("scene_middle").setDepth(100);
      graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
    }

    for (var j = 0; j < 4; j++) {
      var group;

      if (this.backsGroups.length > j) {
        group = this.backsGroups[j];
      }
      else {
        group = this._scene.add.group();
        this.backsGroups.push(group);
      }

      for (var i = 0; i <= endIndex; i++) {
        var sprite;

        if (group.children.entries.length <= i) {
          sprite = this._scene.add.sprite(0, 0, 'cardBack', 0)
            .setVisible(false)
            .setDepth(2 + i)
            .setScale(0.5, 0.5)
            .setOrigin(0)
            .setX(this.options.middlePoint.x - gameOptions.cardWidth / 4)
            .setY(this.options.middlePoint.y - gameOptions.cardHeight / 4 + this.options.allignFunc(i));

          group.add(sprite);
        }
        else {
          sprite = group.children.entries[i] as GameObjects.Sprite;
        }
      }

      if (j % 2 == 1) {
        group.rotate(1.5707963268);
      }
    }
  }

  static ArrangeMainPlayer(endIndex: number) {
    var group = this.backsGroups[0];

    var card: Card;
    for (var i = 0; i <= endIndex; i++) {

      if (this._dealtCards.length > i) {
        card = this._dealtCards[i];
      }
      else {
        do {
          card = Phaser.Utils.Array.GetRandom(this.cards) as Card;
        }
        while (this._dealtCards.includes(card))
      }

      if (this._dealtCards.length > i == false)
        this._dealtCards.push(card);

      if (gameOptions.arrangeByStrength)
        this.ArrangeHandByStrength();
    }

    this.createTimeline(group, { ...this.options } as HandPositionOptions);
  }

  static ArrangeRightPlayer(endIndex: number) {
    var group = this.backsGroups[1];
    this.options.allignFunc = function (i) { return -(3.75 * Math.pow(i, 2) - 15 * i + 15); };

    this.createTimeline(group, { ...this.options } as HandPositionOptions);
  }

  static ArrangeUpPlayer(endIndex: number) {
    var group = this.backsGroups[2];
    this.options.allignFunc = function (i) { return -(3.75 * Math.pow(i, 2) - 15 * i + 15); };

    this.createTimeline(group, { ...this.options } as HandPositionOptions);
  }

  static ArrangeLeftPlayer(endIndex: number) {
    var group = this.backsGroups[3];

    this.createTimeline(group, { ...this.options } as HandPositionOptions);
  }

  static initDeck() {
    var x: number = 0, y: number = gameOptions.cardHeight / 2, index = 0;
    for (var i = 0; i < 32; i++) {
      x = gameOptions.cardWidth * index;
      index++;
      if (x > window.innerWidth) {
        x = 0;
        index = 0;
        y += gameOptions.cardHeight;
      }

      var suit = i % 4, rank = Math.floor(7 + i / 4);

      this.cards[i] = new Card(suit, rank, this._scene.add.sprite(0, 0, 'belotCards', i)
        .setVisible(false)
        .setOrigin(0)
        .setName("suit: " + suit + " rank: " + rank));
    }
  }

  static createTimeline(group: Phaser.GameObjects.Group, options: HandPositionOptions) {
    var _targets = group.children.entries.slice(0, 3);
    var middleIndex = Math.ceil(_targets.length / 2) - 1;
    var timeLineThree = this._scene.tweens.createTimeline();

    timeLineThree.add({
      targets: _targets,
      y: this.options.middlePoint.y,
      x: this.options.middlePoint.x - gameOptions.cardWidth / 4,
      ease: 'Sine.easeOut',
      delay: this._scene.tweens.stagger(200, {}),
      duration: 500,
      onComplete: this.showCard,
      onCompleteParams: [this._dealtCards, group, middleIndex, options],
      onStart: this.dealCard,
      onStartParams: [group, options],
      callbackContext: this._scene
    });

    middleIndex = Math.ceil(5 / 2) - 1;
    
    timeLineThree.add({
      targets: group.children.entries.slice(3, 5),
      y: this.options.middlePoint.y,
      x: this.options.middlePoint.x - gameOptions.cardWidth / 4,
      ease: 'Sine.easeOut',
      delay: this._scene.tweens.stagger(200, {}),
      duration: 500,
      onComplete: this.showCard,
      onCompleteParams: [this._dealtCards, group, middleIndex, options],
      onStart: this.dealCard,
      onStartParams: [group],
      callbackContext: this._scene
    });

    timeLineThree.play();
  }

  static dealCard(tween: Phaser.Tweens.Tween, targets: Phaser.GameObjects.Sprite[], group: GameObjects.Group, options: HandPositionOptions) {
    targets.forEach((x) => x
      .setVisible(true)
      .setRotation(options.initTiltAngleRadians));
    console.log('started dealing ' + targets.length);
  }

  static showCard(tween: Phaser.Tweens.Tween, targets: GameObjects.Sprite[], dealtCards: Card[], group: GameObjects.Group, middleIndex: number, options: HandPositionOptions) {
    console.log('finishing dealing ' + group.children.entries.length);

    targets.forEach((sprite, i, targets) => {
      sprite
        .setRotation(options.initTiltAngleRadians);

      sprite.x -= options.cardsOffset * (middleIndex - i);
      sprite.y += options.allignFunc(i);

      if (options.isMainPlayer) {
        sprite
          .setTexture(dealtCards[i].sprite.texture.key, dealtCards[i].sprite.frame.name)
          .setName(dealtCards[i].sprite.name)
          .setInteractive()
          .on('pointerover', function (this: GameObjects.Sprite, e: any) {
            this.y -= 15;
            this.input.cursor = 'hand';
          }, targets[i])
          .on('pointerout', function (this: GameObjects.Sprite, event: any) {
            this.y += 15;
            this.input.cursor = 'pointer';
          }, targets[i]);
      }
    });
  }

  static ArrangeHandByStrength() {
    throw new Error("Method not implemented.");
  }  
}

export default Dealer
