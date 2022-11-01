import { Game, GameObjects } from "phaser";
import { gameOptions } from "../../main";
import Card from "../GameObjects/Card";

class HandPositionOptions {
  middlePoint: Phaser.Geom.Point = new Phaser.Geom.Point();
  cardsOffset: number = 0;
  allignFuncY!: (index: number, playerNumber: PlayerNumber, middleIndex: number) => number;
  allignFuncX!: (index: number, playerNumber: PlayerNumber, middleIndex: number) => number;
  initTiltAngleRadians: number = 0;
  stepTiltAngleRadians: number = 0;
  readonly sceneMiddlePoint = new Phaser.Geom.Point(window.innerWidth / 2, window.innerHeight / 2);
  isMainPlayer: boolean = false;
  player: 0 | 1 | 2 | 3 = 0;

  readonly mainPlayerAllignFuncs = {
    x: (middleIndex: number, i: number) => -this.cardsOffset * (middleIndex - i) - gameOptions.cardWidth / 4,
    y3: (i: number) => this.threeAllignFunc(i),
    y5: (i: number) => this.fiveAllignFunc(i)
  };
  readonly leftPlayerAllignFuncs = {
    x3: (i: number) => this.threeAllignFunc(i),
    x5: (i: number) => this.fiveAllignFunc(i),
    y: (middleIndex: number, i: number) => -this.cardsOffset * (middleIndex - i) - gameOptions.cardWidth / 4,
  };
  readonly upPlayerAllignFuncs = {
    x: (middleIndex: number, i: number) => -this.cardsOffset * (middleIndex - i) + gameOptions.cardWidth / 4,
    y3: (i: number) => -this.threeAllignFunc(i),
    y5: (i: number) => -this.fiveAllignFunc(i)
  }
  readonly rightPlayerAllignFuncs = {
    x3: (i: number) => this.threeAllignFunc(i),
    x5: (i: number) => this.fiveAllignFunc(i),
    y: (middleIndex: number, i: number) => this.cardsOffset * (middleIndex - i) + gameOptions.cardWidth / 4,
  };

  readonly threeAllignFunc = (i: number): number => { var sign = this.player >= 2 ? 1 : -1; return (3.75 * Math.pow(i, 2) - 7.5 * i + 3.75) * sign; };
  readonly fiveAllignFunc = (i: number): number => { var sign = this.player >= 2 ? 1 : -1; return (3.75 * Math.pow(i, 2) - 15 * i + 15) * sign; };
  readonly sevenAllignFunc = (i: number): number => { return 0; };

  setMiddlePoint(x: number, y: number) {
    this.middlePoint = new Phaser.Geom.Point(x, y);
  }

  setCardsOffset(offset: number) {
    this.cardsOffset = offset;
  }

  copy(this: HandPositionOptions): HandPositionOptions {
    var result = new HandPositionOptions();

    result.middlePoint = this.middlePoint;
    result.allignFuncY = this.allignFuncY;
    result.allignFuncX = this.allignFuncX;
    result.cardsOffset = this.cardsOffset;
    result.initTiltAngleRadians = this.initTiltAngleRadians;
    result.stepTiltAngleRadians = this.stepTiltAngleRadians;
    result.isMainPlayer = this.isMainPlayer;
    result.player = this.player;

    return result;
  }
}

class Dealer {
  static dealer: 0 | 1 | 2 | 3;
  static cards: Card[] = [];
  public static backsGroups: Phaser.GameObjects.Group[] = [];
  static _scene: Phaser.Scene;
  static options: HandPositionOptions = new HandPositionOptions();
  static _dealtCards: Card[] = [];
  static paths: Phaser.Curves.Path[] = [];
  static awaitPreviousCard = false;

  public static setDealer(playerNumber: 0 | 1 | 2 | 3) {
    this.dealer = playerNumber;
  }

  public static FirstDeal() {
    this.options.setCardsOffset(gameOptions.cardWidth / 2);

    this.CreateBacks();
    this._dealtCards = [];
    this.Deal(0);
    this.Deal(1);
    this.Deal(2);
    this.Deal(3);
  }

  static Deal(playerNumber: PlayerNumber) {
    this.options.player = playerNumber;

    switch (playerNumber) {
      case 0: {
        this.options.setMiddlePoint(window.innerWidth / 2, window.innerHeight - gameOptions.cardHeight / 1.5);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.stepTiltAngleRadians = 0.1745329252;
        this.options.isMainPlayer = true;
        this.ArrangeMainPlayer();

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 1: {
        this.options.setMiddlePoint(gameOptions.cardWidth * 2.5, window.innerHeight / 2);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.stepTiltAngleRadians = 0.1745329252;
        this.options.isMainPlayer = false;
        this.ArrangeLeftPlayer();

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 2: {
        this.options.setMiddlePoint(window.innerWidth / 2, gameOptions.cardHeight / 1.5);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.stepTiltAngleRadians = 0.1745329252;
        this.options.isMainPlayer = false;
        this.ArrangeUpPlayer();

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 3: {
        this.options.setMiddlePoint(window.innerWidth - gameOptions.cardWidth * 2.5, window.innerHeight / 2);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.stepTiltAngleRadians = 0.1745329252;
        this.options.isMainPlayer = false;
        this.ArrangeRightPlayer();

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
    }
  }

  static CreateBacks() {
    if (this._scene.children.getByName("scene_middle") === null) {
      var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setName("scene_middle").setDepth(100);
      graphics.fillPointShape(new Phaser.Geom.Point(this.options.sceneMiddlePoint.x, this.options.sceneMiddlePoint.y), 10);
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

      for (var i = 0; i <= 4; i++) {
        var sprite = this._scene.add.sprite(0, 0, 'cardBack', 0)
            .setVisible(false)
            .setDepth(2 + i)
            .setScale(0.5, 0.5)
            .setOrigin(0)
            .setX(this.options.sceneMiddlePoint.x - gameOptions.cardWidth / 4)
            .setY(this.options.sceneMiddlePoint.y - gameOptions.cardHeight / 4);

          group.add(sprite);
      }

      switch (j) {
        case 0: {
          group
            .angle(0)
            .incX(0)
            .incY(0); // added just for clarity
        } break;
        case 1: {
          group
            .angle(270)
            .incX(-(gameOptions.cardHeight - gameOptions.cardWidth) / 4)
            .incY(gameOptions.cardWidth / 2 + (gameOptions.cardHeight - gameOptions.cardWidth) / 4);
        } break;
        case 2: {
          group
            .angle(180)
            .incX(gameOptions.cardWidth / 2)
            .incY(gameOptions.cardHeight / 2);
        } break;
        case 3: {
          group
            .angle(90)
            .incX(gameOptions.cardWidth / 2 + (gameOptions.cardHeight - gameOptions.cardWidth) / 4)
            .incY((gameOptions.cardHeight - gameOptions.cardWidth) / 4);
        } break;
      }
    }
  }

  static ArrangeMainPlayer() {
    var group = this.backsGroups[0];
    var goalPoint = new Phaser.Geom.Point(
      this.options.middlePoint.x - gameOptions.cardWidth / 4,
      this.options.middlePoint.y
    );

    var card: Card;
    for (var i = 0; i <= 4; i++) {

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

    this.createTimeline(group, { ...this.options } as HandPositionOptions, goalPoint);
  }

  static ArrangeRightPlayer() {
    var group = this.backsGroups[1];
    var goalPoint = new Phaser.Geom.Point(
      this.options.middlePoint.x,
      (group.getChildren()[0] as GameObjects.Sprite).y
    );
    this.options.allignFuncY = function (i) { return -(3.75 * Math.pow(i, 2) - 15 * i + 15); };

    this.createTimeline(group, this.options.copy(), goalPoint);
  }

  static ArrangeUpPlayer() {
    var group = this.backsGroups[2];
    var goalPoint = new Phaser.Geom.Point(
      (group.getChildren()[0] as GameObjects.Sprite).x,
      this.options.middlePoint.y
    );
    this.options.allignFuncY = function (i) { return -(3.75 * Math.pow(i, 2) - 15 * i + 15); };

    this.createTimeline(group, this.options.copy(), goalPoint);
  }

  static ArrangeLeftPlayer() {
    var group = this.backsGroups[3];
    var goalPoint = new Phaser.Geom.Point(
      this.options.middlePoint.x,
      (group.getChildren()[0] as GameObjects.Sprite).y
    );

    this.createTimeline(group, this.options.copy(), goalPoint);
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

  static createTimeline(group: Phaser.GameObjects.Group, options: HandPositionOptions, goalPoint: Phaser.Geom.Point) {
    var _targets = group.children.entries.slice(0, 3);
    var middleIndex = Math.ceil(_targets.length / 2) - 1;
    var timeLineThree = this._scene.tweens.createTimeline();

    timeLineThree.add({
      targets: _targets,
      y: goalPoint.y,
      x: goalPoint.x,
      ease: 'Sine.easeOut',
      delay: this._scene.tweens.stagger(200, {}),
      duration: 500,
      onComplete: this.showCard,
      onCompleteParams: [this._dealtCards, group, middleIndex, options, 3],
      onStart: this.dealCard,
      callbackContext: this._scene      
    }); // first three

    middleIndex = Math.ceil(group.children.entries.length / 2) - 1;
    
    timeLineThree.add({
      targets: group.children.entries.slice(3, 5),
      y: goalPoint.y,
      x: goalPoint.x,
      ease: 'Sine.easeOut',
      delay: this._scene.tweens.stagger(200, {}),
      duration: 500,
      onComplete: this.showCard,
      onCompleteParams: [this._dealtCards, group, middleIndex, options, 5],
      onStart: this.dealCard,
      callbackContext: this._scene
    }); // second two

    timeLineThree.play();
  }

  static dealCard(tween: Phaser.Tweens.Tween, targets: Phaser.GameObjects.Sprite[]) {
    targets.forEach((x) => x
      .setVisible(true));
  }

  static showCard(tween: Phaser.Tweens.Tween, targets: GameObjects.Sprite[], dealtCards: Card[], group: GameObjects.Group, middleIndex: number, options: HandPositionOptions, count: number) {
    for (var i = 0; i < count; i++) {
      var xOffset = 0, yOffset = 0, sprite = group.getChildren()[i] as GameObjects.Sprite;

      switch (options.player) {
        case 0: {
          xOffset = options.mainPlayerAllignFuncs.x(middleIndex, i);
          yOffset = count == 3 ? options.mainPlayerAllignFuncs.y3(i) : options.mainPlayerAllignFuncs.y5(i);
        } break;
        case 1: {
          xOffset = count == 3 ? options.leftPlayerAllignFuncs.x3(i) : options.leftPlayerAllignFuncs.x5(i);
          yOffset = options.leftPlayerAllignFuncs.y(middleIndex, i);
        } break;
        case 2: {
          xOffset = options.upPlayerAllignFuncs.x(middleIndex, i);
          yOffset = count == 3 ? options.upPlayerAllignFuncs.y3(i) : options.upPlayerAllignFuncs.y5(i);
        } break;
        case 3: {
          xOffset = count == 3 ? options.rightPlayerAllignFuncs.x3(i) : options.rightPlayerAllignFuncs.x5(i);
          yOffset = options.rightPlayerAllignFuncs.y(middleIndex, i);
        } break;
        default:
      }

      sprite.x = options.middlePoint.x + xOffset;
      sprite.y = options.middlePoint.y + yOffset;

      if (options.isMainPlayer && sprite.name.length === 0) {
        sprite
          .setTexture(dealtCards[i].sprite.texture.key, dealtCards[i].sprite.frame.name)
          .setName(dealtCards[i].sprite.name)
          .setInteractive()
          .on('pointerover', function (this: GameObjects.Sprite, event: any) {
            this.y -= 15;
            this.input.cursor = 'hand';
          }, targets[i])
          .on('pointerout', function (this: GameObjects.Sprite, event: any) {
            this.y += 15;
            this.input.cursor = 'pointer';
          }, targets[i]);
      }      
    }
  }

  static ArrangeHandByStrength() {
    throw new Error("Method not implemented.");
  }  
}

export default Dealer
