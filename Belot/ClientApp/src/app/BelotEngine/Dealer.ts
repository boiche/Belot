import { Game, GameObjects } from "phaser";
import { constants, gameOptions } from "../../main";
import Card from "../GameObjects/Card";
import GameTableScene from "../scenes/game-table-scene";

class HandPositionOptions {
  middlePoint: Phaser.Geom.Point = new Phaser.Geom.Point();
  cardsOffset: number = 0;
  stepTiltAngle: number = 0;
  readonly sceneMiddlePoint = new Phaser.Geom.Point(window.innerWidth / 2, window.innerHeight / 2);
  isMainPlayer: boolean = false;
  player: 0 | 1 | 2 | 3 = 0;

  readonly mainPlayerAllignFuncs = {
    x: (middleIndex: number, i: number, count: number) => { var evenOffset = count % 2 == 0 ? gameOptions.cardWidth * 10 / 24 : gameOptions.cardWidth / 4; return -this.cardsOffset * (middleIndex - i) - evenOffset },
    y3: (i: number) => -this.threeAllignFunc(i),
    y5: (i: number) => -this.fiveAllignFunc(i),
    y8: (i: number) => -this.eightAllignFunc(i),
    rotate: (middleIndex: number, i: number) => this.mainPlayerInitAngle //- this.stepTiltAngle * (middleIndex - i)
  };
  readonly leftPlayerAllignFuncs = {
    x3: (i: number) => this.threeAllignFunc(i),
    x5: (i: number) => this.fiveAllignFunc(i),
    x8: (i: number) => this.eightAllignFunc(i),
    y: (middleIndex: number, i: number, count: number) => { var evenOffset = count % 2 == 0 ? gameOptions.cardWidth * 10 / 24 : gameOptions.cardWidth / 4; return -this.cardsOffset * (middleIndex - i) - evenOffset; },
    rotate: (middleIndex: number, i: number) => this.leftPlayerInitAngle //- this.stepTiltAngle * (middleIndex - i)
  };
  readonly upPlayerAllignFuncs = {
    x: (middleIndex: number, i: number, count: number) => { var evenOffset = count % 2 == 0 ? gameOptions.cardWidth / 12 : gameOptions.cardWidth / 4; return -this.cardsOffset * (middleIndex - i) + evenOffset; },
    y3: (i: number) => -this.threeAllignFunc(i),
    y5: (i: number) => -this.fiveAllignFunc(i),
    y8: (i: number) => -this.eightAllignFunc(i),
    rotate: (middleIndex: number, i: number) => this.upPlayerInitAngle //+ this.stepTiltAngle * (middleIndex - i)
  }
  readonly rightPlayerAllignFuncs = {
    x3: (i: number) => this.threeAllignFunc(i),
    x5: (i: number) => this.fiveAllignFunc(i),
    x8: (i: number) => this.eightAllignFunc(i),
    y: (middleIndex: number, i: number, count: number) => { var evenOffset = count % 2 == 0 ? gameOptions.cardWidth * 10 / 24 : gameOptions.cardWidth / 4; return this.cardsOffset * (middleIndex - i) + evenOffset; },
    rotate: (middleIndex: number, i: number) => this.rightPlayerInitAngle //- this.stepTiltAngle * (middleIndex - i)
  };

  readonly mainPlayerInitAngle = 0;
  readonly leftPlayerInitAngle = 270;
  readonly upPlayerInitAngle = 180;
  readonly rightPlayerInitAngle = 90;

  public get mainPlayerGoalPoint() {
    return new Phaser.Geom.Point(this.middlePoint.x - gameOptions.cardWidth / 4, this.middlePoint.y)
  }
  public get leftPlayerGoalPoint() {
    return new Phaser.Geom.Point(this.middlePoint.x, this.middlePoint.y - gameOptions.cardWidth / 4); 
  }
  public get rightPlayerGoalPoint() {
    return new Phaser.Geom.Point(this.middlePoint.x, this.middlePoint.y + gameOptions.cardWidth / 4);
  }
  public get upPlayerGoalPoint() {
    return new Phaser.Geom.Point(this.middlePoint.x + gameOptions.cardWidth / 4, this.middlePoint.y);
  }

  readonly threeAllignFunc = (i: number): number => { var sign = this.player > 1 ? 1 : -1; return (3.75 * Math.pow(i, 2) - 7.5 * i + 3.75) * sign; };
  readonly fiveAllignFunc = (i: number): number => { var sign = this.player > 1 ? 1 : -1; return (3.75 * Math.pow(i, 2) - 15 * i + 15) * sign; };
  readonly eightAllignFunc = (i: number): number => { var sign = this.player > 1 ? 1 : -1; return (2.8125 * Math.pow(i, 2) - 19.6875 * i + 33.75) * sign; };

  setMiddlePoint(x: number, y: number) {
    this.middlePoint = new Phaser.Geom.Point(x, y);
  }

  setCardsOffset(offset: number) {
    this.cardsOffset = offset;
  }

  copy(this: HandPositionOptions): HandPositionOptions {
    var result = new HandPositionOptions();

    result.middlePoint = this.middlePoint;
    result.cardsOffset = this.cardsOffset;
    result.isMainPlayer = this.isMainPlayer;
    result.player = this.player;
    result.stepTiltAngle = this.stepTiltAngle;

    return result;
  }
}

class Dealer {
  dealer!: 0 | 1 | 2 | 3;
  cards: Card[] = [];
  backsGroups: Phaser.GameObjects.Group[] = [];
  _scene!: Phaser.Scene;
  options: HandPositionOptions = new HandPositionOptions();
  _dealtCards: Card[] = [];
  _thrownCards: GameObjects.Sprite[] = [];
  paths: Phaser.Curves.Path[] = [];
  awaitPreviousCard = false;
  firstDealReady = false;
  secondDealReady = false;
  currentDeal!: 0 | 1;

  public setDealer(playerNumber: 0 | 1 | 2 | 3) {
    this.dealer = playerNumber;
  }

  public FirstDeal() {
    this.options.setCardsOffset(gameOptions.cardWidth / 2);
    this._dealtCards = [];
    this.backsGroups = [];
    this.currentDeal = 0;

    this.CreateBacks(5);    
    this.Deal(0);
    this.Deal(1);
    this.Deal(2);
    this.Deal(3);
  }

  public SecondDeal() {
    this.options.setCardsOffset(gameOptions.cardWidth / 3);
    this.currentDeal = 1;

    this.CreateBacks(3);

    this.Deal(0);
    this.Deal(1);
    this.Deal(2);
    this.Deal(3);
  }

  Deal(playerNumber: PlayerNumber) {
    this.options.player = playerNumber;
    this.options.stepTiltAngle = 5;

    switch (playerNumber) {
      case 0: {
        this.options.setMiddlePoint(window.innerWidth / 2, window.innerHeight - gameOptions.cardHeight / 1.5);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.isMainPlayer = true;
        this.ArrangeMainPlayer();

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 1: {
        this.options.setMiddlePoint(gameOptions.cardWidth * 2.5, window.innerHeight / 2);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.isMainPlayer = false;
        this.ArrangeLeftPlayer();

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 2: {
        this.options.setMiddlePoint(window.innerWidth / 2, gameOptions.cardHeight / 1.5);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.isMainPlayer = false;
        this.ArrangeUpPlayer();

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
      case 3: {
        this.options.setMiddlePoint(window.innerWidth - gameOptions.cardWidth * 2.5, window.innerHeight / 2);
        this.options.setCardsOffset(gameOptions.cardWidth / 3);
        this.options.isMainPlayer = false;
        this.ArrangeRightPlayer();

        var graphics = this._scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }).setDepth(100);
        graphics.fillPointShape(new Phaser.Geom.Point(this.options.middlePoint.x, this.options.middlePoint.y), 10);
      } break;
    }
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
          .setScale(0.5, 0.5)
          .setOrigin(0)          
          .setX(this.options.sceneMiddlePoint.x - gameOptions.cardWidth / 4)
          .setY(this.options.sceneMiddlePoint.y - gameOptions.cardHeight / 4);

        switch (j) {
          case 0: {
            sprite
              .setAngle(this.options.mainPlayerInitAngle)
          } break;
          case 1: {
            sprite
              .setAngle(this.options.leftPlayerInitAngle)
              .setX(sprite.x - (gameOptions.cardHeight - gameOptions.cardWidth) / 4)
              .setY(sprite.y + gameOptions.cardWidth / 2 + (gameOptions.cardHeight - gameOptions.cardWidth) / 4);
          } break;
          case 2: {
            sprite
              .setAngle(this.options.upPlayerInitAngle)
              .setX(sprite.x + gameOptions.cardWidth / 2)
              .setY(sprite.y + gameOptions.cardHeight / 2);
          } break;
          case 3: {
            sprite
              .setAngle(this.options.rightPlayerInitAngle)
              .setX(sprite.x + gameOptions.cardWidth / 2 + (gameOptions.cardHeight - gameOptions.cardWidth) / 4)
              .setY(sprite.y + (gameOptions.cardHeight - gameOptions.cardWidth) / 4);
          } break;
        }

        group.add(sprite);
      }      
    }
  }

  ArrangeMainPlayer() {
    var group = this.backsGroups[0];

    var card: Card;
    for (var i = 0; i <= 7; i++) {

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

    if (this.currentDeal == 0) {
      this.createTimelineFirstDeal(group, this.options.copy(), this.options.mainPlayerGoalPoint);
    }
    else {
      this.createTimeLineSecondDeal(group, this.options.copy(), this.options.mainPlayerGoalPoint);
    }
  }

  ArrangeRightPlayer() {
    var group = this.backsGroups[1];

    if (this.currentDeal == 0) {
      this.createTimelineFirstDeal(group, this.options.copy(), this.options.rightPlayerGoalPoint);
    }
    else {
      this.createTimeLineSecondDeal(group, this.options.copy(), this.options.rightPlayerGoalPoint);
    }
  }

  ArrangeUpPlayer() {
    var group = this.backsGroups[2];

    if (this.currentDeal == 0) {
      this.createTimelineFirstDeal(group, this.options.copy(), this.options.upPlayerGoalPoint);
    }
    else {
      this.createTimeLineSecondDeal(group, this.options.copy(), this.options.upPlayerGoalPoint);
    }
  }

  ArrangeLeftPlayer() {
    var group = this.backsGroups[3];

    if (this.currentDeal == 0) {
      this.createTimelineFirstDeal(group, this.options.copy(), this.options.leftPlayerGoalPoint); 
    }
    else {
      this.createTimeLineSecondDeal(group, this.options.copy(), this.options.leftPlayerGoalPoint);
    }
  }

  initDeck() {
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

  createTimelineFirstDeal(group: Phaser.GameObjects.Group, options: HandPositionOptions, goalPoint: Phaser.Geom.Point) {
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
      onCompleteParams: [group, middleIndex, options, 3, this],
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
      onCompleteParams: [group, middleIndex, options, 5, this],
      onStart: this.dealCard,
      callbackContext: this._scene
    }); // second two

    timeLineThree.play();
  }

  createTimeLineSecondDeal(group: Phaser.GameObjects.Group, options: HandPositionOptions, goalPoint: Phaser.Geom.Point) {
    var _targets = group.children.entries.slice(5, 8);
    var middleIndex = Math.ceil(group.children.entries.length / 2) - 1;
    var timeLine = this._scene.tweens.createTimeline();

    timeLine.add({
      targets: _targets,
      y: goalPoint.y,
      x: goalPoint.x,
      ease: 'Sine.easeOut',
      delay: this._scene.tweens.stagger(200, {}),
      duration: 500,
      onComplete: this.showCard,
      onCompleteParams: [group, middleIndex, options, 8, this],
      onStart: this.dealCard,
      callbackContext: this._scene
    });

    timeLine.play();
  }

  dealCard(tween: Phaser.Tweens.Tween, targets: Phaser.GameObjects.Sprite[]) {
    targets.forEach((x) => x
      .setVisible(true));
  }

  showCard(tween: Phaser.Tweens.Tween, targets: GameObjects.Sprite[], group: GameObjects.Group, middleIndex: number, options: HandPositionOptions, count: number, dealer: Dealer) {
    for (var i = 0; i < count; i++) {
      var xOffset = 0, yOffset = 0, angle = 0, sprite = group.getChildren()[i] as GameObjects.Sprite;
      
      switch (options.player) {
        case 0: {
          xOffset = options.mainPlayerAllignFuncs.x(middleIndex, i, count);
          if (count <= 3) {
            yOffset = options.mainPlayerAllignFuncs.y3(i);
          }
          else if (count <= 5) {
            yOffset = options.mainPlayerAllignFuncs.y5(i);
          }
          else {
            yOffset = options.mainPlayerAllignFuncs.y8(i);
          }

          angle = options.mainPlayerAllignFuncs.rotate(middleIndex, i);
        } break;
        case 1: {
          if (count <= 3) {
            xOffset = options.leftPlayerAllignFuncs.x3(i);
          }
          else if (count <= 5) {
            xOffset = options.leftPlayerAllignFuncs.x5(i);
          }
          else {
            xOffset = options.leftPlayerAllignFuncs.x8(i);
          }

          yOffset = options.leftPlayerAllignFuncs.y(middleIndex, i, count);
          angle = options.leftPlayerAllignFuncs.rotate(middleIndex, i);
        } break;
        case 2: {
          xOffset = options.upPlayerAllignFuncs.x(middleIndex, i, count);
          if (count <= 3) {
            yOffset = options.upPlayerAllignFuncs.y3(i);
          }
          else if (count <= 5) {
            yOffset = options.upPlayerAllignFuncs.y5(i);
          }
          else {
            yOffset = options.upPlayerAllignFuncs.y8(i);
          }

          angle = options.upPlayerAllignFuncs.rotate(middleIndex, i);
        } break;
        case 3: {
          if (count <= 3) {
            xOffset = options.rightPlayerAllignFuncs.x3(i);
          }
          else if (count <= 5) {
            xOffset = options.rightPlayerAllignFuncs.x5(i);
          }
          else {
            xOffset = options.rightPlayerAllignFuncs.x8(i);
          }
          yOffset = options.rightPlayerAllignFuncs.y(middleIndex, i, count);
          angle = options.rightPlayerAllignFuncs.rotate(middleIndex, i);
        } break;
        default:
      }

      sprite.x = options.middlePoint.x + xOffset;
      sprite.y = options.middlePoint.y + yOffset;      
      //sprite.angle = angle;

      if (options.isMainPlayer && sprite.name.includes(constants.cardBack)) {
        sprite
          .setTexture(dealer._dealtCards[i].sprite.texture.key, dealer._dealtCards[i].sprite.frame.name)
          .setName(constants.belotGameObjectName + dealer._dealtCards[i].sprite.name)
          .setInteractive({ cursor: 'pointer' })
          .disableInteractive()
          .on('pointerover', function (this: GameObjects.Sprite, event: any) {
            this.y -= 15;
          }, targets[i])
          .on('pointerout', function (this: GameObjects.Sprite, event: any) {
            this.y += 15;
          }, targets[i])
          .on('pointerdown', function (this: GameObjects.Sprite, event: any) {            
            var scene = (this.scene as GameTableScene);
            scene.dealer.throwCard(this);            
          }, targets[i]);

        console.log("card with index " + i + " is card " + sprite.name);
      }      
    }

    if (count === 5) {
      dealer.firstDealReady = true;
    }
    if (count === 8) {
      dealer.secondDealReady = true;
      if (options.isMainPlayer) {
        dealer.enableCards(tween, targets[0], group);
      }
    }
  }

  disableCards(tween: Phaser.Tweens.Tween, sprite: Phaser.GameObjects.Sprite, cards: Phaser.GameObjects.Group) {
    cards.getChildren().forEach(x => x.disableInteractive());
  }

  enableCards(tween: Phaser.Tweens.Tween, sprite: GameObjects.Sprite, cards: Phaser.GameObjects.Group) {
    cards.getChildren().forEach(x => x.setInteractive());
  }

  throwCard(sprite: Phaser.GameObjects.Sprite) {
    sprite.removeInteractive().removeAllListeners();

    this._scene.add.tween({
      targets: [sprite],
      ease: "Quart.easeOut",
      x: window.innerWidth / 2 - gameOptions.cardWidth / 2 * Math.random(),
      y: window.innerHeight / 2 - gameOptions.cardHeight / 2 * Math.random(),
      onStart: this.disableCards,
      onStartParams: [this.backsGroups[0]],
      onComplete: this.collectCards,
      onCompleteParams: [this.backsGroups[0]],
      callbackScope: this
    });

    this._thrownCards.push(sprite);
  }

  //TODO: this method is for demo of collecting the cards to the player. OBSOLETE !!!
  collectCards(tween: Phaser.Tweens.Tween, sprite: GameObjects.Sprite, cards: Phaser.GameObjects.Group) {
    var main = new Phaser.Geom.Point(window.innerWidth / 2 - gameOptions.cardWidth / 4, window.innerHeight);
    var up = new Phaser.Geom.Point(window.innerWidth / 2 - gameOptions.cardWidth / 4, 0 - gameOptions.cardHeight / 2);
    var left = new Phaser.Geom.Point(0 - gameOptions.cardWidth / 2, window.innerHeight / 2 - gameOptions.cardHeight / 4);
    var right = new Phaser.Geom.Point(window.innerWidth, window.innerHeight / 2 - gameOptions.cardHeight / 4);

    if (this._thrownCards.length == 4) {
      this._scene.add.tween({
        targets: this._thrownCards,
        delay: 250,
        ease: 'Expo.easeOut',
        x: main.x,
        y: main.y,
        onComplete: this.clearCards
      });

      this._thrownCards = [];
    }

    this.enableCards(tween, sprite, cards);
  }

  clearCards(tween: Phaser.Tweens.Tween, targets: GameObjects.Sprite[]) {
    for (var i = 0; i < targets.length; i++) {
      targets[i].scene.children.remove(targets[i], true).removeAllListeners().removeInteractive();
    }
  }

  ArrangeHandByStrength() {
    this._dealtCards.sort((first, second) => {
      if (first.suit > second.suit)
        return -1;
      else if (first.suit < second.suit)
        return 1;
      else {
        if (first.rank > second.rank)
          return -1;
        else if (first.rank < second.rank)
          return 1;
        else
          throw('cannot have two equal cards');
      }
    });
  }  
}

export default Dealer
