import { Game, GameObjects } from "phaser";
import { gameOptions } from "../../main";
import Card from "../GameObjects/Card";

class HandPositionOptions {
  middlePoint: Phaser.Geom.Point = new Phaser.Geom.Point();
  lowerBoundOffset: number = 0;
  upperBoundOffset: number = 0;
  cardsOffset: number = 0;
  allignFunc!: (x: number) => number;
  initTiltAngleRadians: number = 0;
  stepTiltAngleRadians: number = 0;

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


  public static setDealer(playerNumber: 0 | 1 | 2 | 3) {
    this.dealer = playerNumber;
  }

  public static FirstDeal() {
    this.options.setCardsOffset(gameOptions.cardWidth / 2);
    this.options.allignFunc = this.options.threeAllignFunc;

    this.CreateBacks(2);
    this._dealtCards = [];
    setTimeout(() => this.Deal(2, 0), 1000);
    setTimeout(() => this.Deal(2, 1), 1500);
    setTimeout(() => this.Deal(2, 2), 2000);
    setTimeout(() => this.Deal(2, 3), 2500);

    setTimeout(() => {
      this.options.allignFunc = this.options.fiveAllignFunc;

      setTimeout(() => this.CreateBacks(4), 250);
      setTimeout(() => this.Deal(4, 0), 1000);
      setTimeout(() => this.Deal(4, 1), 1500);
      setTimeout(() => this.Deal(4, 2), 2000);
      setTimeout(() => this.Deal(4, 3), 2500);
    }, 3000);
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
        this.ArrangeMainPlayer(endIndex);

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 1: {
        this.options.setMiddlePoint(gameOptions.cardWidth * 2.5, window.innerHeight / 2);
        this.options.setCardsOffset(gameOptions.cardWidth / 2);
        this.options.initTiltAngleRadians = 1.5707963268; //360 deg
        this.options.stepTiltAngleRadians = 0.1745329252 / (endIndex - middleIndex); //20 deg
        this.ArrangeLeftPlayer(endIndex);

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 2: {
        this.options.setMiddlePoint(window.innerWidth / 2, gameOptions.cardHeight / 1.5);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.initTiltAngleRadians = 3.1415926536; //180 deg
        this.options.stepTiltAngleRadians = 0.1745329252 / (endIndex - middleIndex); //20 deg
        this.ArrangeUpPlayer(endIndex);

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 3: {
        this.options.setMiddlePoint(window.innerWidth - gameOptions.cardWidth * 2.5, window.innerHeight / 2);
        this.options.setCardsOffset(gameOptions.cardWidth / 2);
        this.options.initTiltAngleRadians = 4.7123889804; //270 deg
        this.options.stepTiltAngleRadians = 0.1745329252 / (endIndex - middleIndex); //20 deg
        this.ArrangeRightPlayer(endIndex);

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
    }
  }

  static CreateBacks(endIndex: number) {
    this.options.setMiddlePoint(window.innerWidth / 2, 0);
    this.options.setCardsOffset(gameOptions.cardWidth / 3);
    var middleIndex = Math.ceil(endIndex / 2);

    for (var j = 0; j < 4; j++) {
      var group, indexOffset = 0;;

      if (this.backsGroups.length > j) {
        group = this.backsGroups[j];
      }
      else {
        group = this._scene.add.group();
        this.backsGroups.push(group);
      }

      for (var i = 0; i <= endIndex; i++) {
        var sprite;

        if (indexOffset > i) {
          indexOffset = 0;
        }
        else {
          indexOffset++;
        }

        if (group.children.entries.length <= i) {
          sprite = this._scene.add.sprite(0, 0, 'cardBack', 0)
            .setVisible(false)
            .setDepth(2 + i)
            .setScale(0.5, 0.5)
            .setOrigin(0);            

          group.add(sprite);
        }
        else {
          sprite = group.children.entries[i] as GameObjects.Sprite;
        }

        sprite
          .setX(this.options.middlePoint.x - (this.options.cardsOffset * (middleIndex - indexOffset)))
          .setY(this.options.middlePoint.y + this.options.allignFunc(i));
      }
    }
  }

  static ArrangeMainPlayer(endIndex: number) {
    var middleIndex = Math.ceil((this.backsGroups[3].children.entries.length - 1) / 2);
    var middleSprite = (this.backsGroups[3].children.entries as GameObjects.Sprite[])[middleIndex];

    this.backsGroups[3]
      .incY(this.options.middlePoint.y - middleSprite.y)
      .incX(this.options.middlePoint.x - middleSprite.x - gameOptions.cardWidth / 4)
      .rotateAround(this.options.middlePoint, this.options.initTiltAngleRadians);

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


      var sprite = this.backsGroups[3].children.entries[i] as GameObjects.Sprite;
      sprite
        .setRotation(this.options.initTiltAngleRadians - this.options.stepTiltAngleRadians * (middleIndex - i));

      if (!sprite.visible) {
        this.backsGroups[3].children.entries[i] =
          sprite
            .setTexture(card.sprite.texture.key, card.sprite.frame.name)
            .setName(card.sprite.name)
            .setVisible(true)
            .setInteractive()            
            .on('pointerover', function (this: GameObjects.Sprite, e: any) {
              this.y -= 15;
              this.input.cursor = 'hand';
            }, sprite)
            .on('pointerout', function (this: GameObjects.Sprite, event: any) {
              this.y += 15;
              this.input.cursor = 'pointer';
            }, sprite);       
      }

      if (this._dealtCards.length > i == false)
        this._dealtCards.push(card);

      if (gameOptions.arrangeByStrength)
        this.ArrangeHandByStrength();
    }
  }

  static ArrangeRightPlayer(endIndex: number) {
    var middleIndex = Math.ceil((this.backsGroups[3].children.entries.length - 1) / 2);
    this.options.allignFunc = function (i) { return -(3.75 * Math.pow(i, 2) - 15 * i + 15); };
    var middleSprite = (this.backsGroups[0].children.entries as GameObjects.Sprite[])[middleIndex];

    this.backsGroups[0]
      .setVisible(true)
      .incY(this.options.middlePoint.y - middleSprite.y)
      .incX(this.options.middlePoint.x - middleSprite.x - gameOptions.cardWidth / 4)
      .rotateAround(this.options.middlePoint, this.options.initTiltAngleRadians);

    for (var i = 0; i < this.backsGroups[0].children.entries.length; i++) {
      var sprite = (this.backsGroups[0].children.entries[i] as Phaser.GameObjects.Sprite);
      sprite
        .setRotation(this.options.initTiltAngleRadians - this.options.stepTiltAngleRadians * (middleIndex - i));
    }
  }

  static ArrangeUpPlayer(endIndex: number) {
    var middleIndex = Math.ceil((this.backsGroups[3].children.entries.length - 1) / 2);
    this.options.allignFunc = function (i) { return -(3.75 * Math.pow(i, 2) - 15 * i + 15); };
    var middleSprite = (this.backsGroups[2].children.entries as Phaser.GameObjects.Sprite[])[middleIndex];

    this.backsGroups[2]
      .setVisible(true)
      .incY(this.options.middlePoint.y - middleSprite.y + gameOptions.cardHeight / 2)
      .incX(this.options.middlePoint.x - middleSprite.x + gameOptions.cardWidth / 4)
      .rotateAround(this.options.middlePoint, this.options.initTiltAngleRadians);

    for (var i = 0; i < this.backsGroups[2].children.entries.length; i++) {
      var sprite = (this.backsGroups[2].children.entries[i] as Phaser.GameObjects.Sprite);
      sprite
        .setRotation(-this.options.stepTiltAngleRadians * (middleIndex - i));
    }
  }

  static ArrangeLeftPlayer(endIndex: number) {
    var middleIndex = Math.ceil((this.backsGroups[3].children.entries.length - 1) / 2);
    var middleSprite = (this.backsGroups[1].children.entries as Phaser.GameObjects.Sprite[])[middleIndex];

    this.backsGroups[1]
      .setVisible(true)
      .incY(this.options.middlePoint.y - middleSprite.y)
      .incX(this.options.middlePoint.x - middleSprite.x - gameOptions.cardWidth / 4)
      .rotateAround(this.options.middlePoint, this.options.initTiltAngleRadians);

    for (var i = 0; i < this.backsGroups[1].children.entries.length; i++) {
      (this.backsGroups[1].children.entries[i] as Phaser.GameObjects.Sprite)
        .setRotation(this.options.initTiltAngleRadians - this.options.stepTiltAngleRadians * (middleIndex - i));
    }
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

  static ArrangeHandByStrength() {
    throw new Error("Method not implemented.");
  }
}

export default Dealer
