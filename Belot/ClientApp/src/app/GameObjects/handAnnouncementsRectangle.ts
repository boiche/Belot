import { GameObjects, Geom } from "phaser";
import { constants, gameOptions, getScales } from "../../main";;
import { GameAnnouncementType, HandAnnouncement, HandAnnouncementType } from "../BelotEngine/Announcement";
import GameTableScene from "../scenes/game-table-scene";
import HandAnnouncementRequest from "../server-api/requests/signalR/hand-announcement-request";
import { Card, Rank, Suit } from "./Card";

export default class HandAnnounementsRectangle {
  private _scene: GameTableScene;   
  private _handAnnouncements: HandAnnouncement[];
  private _rectangle!: GameObjects.Rectangle;
  private _scales = getScales();

  public enabled: boolean;

  constructor(scene: GameTableScene) {
    this._scene = scene;
    this.enabled = false;
    this._handAnnouncements = [];
  }

  draw(initialPoint: Geom.Point) {
    var rectangleX = initialPoint.x + gameOptions.sceneLayout.paddings.leftPadding;
    var rectangleY = window.innerHeight - (gameOptions.sceneLayout.rectangles.height + gameOptions.sceneLayout.paddings.bottomPadding);
    this._rectangle = this._scene.add.rectangle(rectangleX, rectangleY, gameOptions.sceneLayout.rectangles.width, gameOptions.sceneLayout.rectangles.height, 0xFFFFFF);

    this._rectangle
      .setOrigin(0, 0)
      .setDepth(1000)      
      .on('pointerover', () => {
        if (this.enabled) {
          this._rectangle.fillColor = gameOptions.hoverColor;
        }        
      })
      .on('pointerout', () => {
        this._rectangle.fillColor = 0xFFFFFF;
      })
      .on('pointerdown', () => {
        if (this.enabled) {
          var request = new HandAnnouncementRequest();
          request.announcement = this._handAnnouncements[0].type;
          request.gameId = this._scene.gameId;
          request.highestRank = this._handAnnouncements[0].details.highestRank;

          this._scene.signalR.Connection.invoke("HandAnnounce", request);

          this._rectangle.disableInteractive();
          this._scene.children
            .getAll()
            .filter(x => x.name === constants.handAnnouncementObjectName)
            .forEach(x => x.destroy(true));

          this.enabled = false;
        }
      });
  }

  showHandAnnouncements() {
    if (this._scene._belotGame.currentAnnouncement.type === GameAnnouncementType.NOSUIT) {
      return;
    }

    var _playingHand = this._scene.currentPlayer.playingHand;

    for (var suit = 0; suit <= Suit.SPADE; suit++) {
      var currentSuit = this._scene.currentPlayer.playingHand.filter(x => x.suit === suit).sort((x, y) => x.rank - y.rank);
      if (currentSuit.length < 3) {
        continue;
      }

      for (var i = 0, j = 2; j < currentSuit.length; i++, j++) {
        var tempJ = j;
        var hasAnnouncement: boolean = false;
        while (Math.abs(currentSuit[i].rank - currentSuit[tempJ].rank) === tempJ - i) {
          tempJ++;
          hasAnnouncement = true;
          if (tempJ >= currentSuit.length) {
            tempJ--;
            break;            
          }
        }

        if (!hasAnnouncement)
          continue;

        //NB: tempJ - i >= 2
        switch (tempJ - i) {
          case 2: this.addHandAnnouncement(HandAnnouncementType.TERCA, currentSuit); break;
          case 3: this.addHandAnnouncement(HandAnnouncementType.QUARTA, currentSuit); break;
          default: this.addHandAnnouncement(HandAnnouncementType.QUINTA, currentSuit); break;
        }

        j = tempJ;
      }
    }

    var rankCount: { key: number, value: number }[] = [];
    for (var i = 0; i < _playingHand.length; i++) {
      if (!rankCount.some(x => x.key === _playingHand[i].rank)) {
        let record = { key: _playingHand[i].rank.valueOf(), value: 1 };
        rankCount.push(record);
      }
      else {
        let record = rankCount.find(x => x.key === _playingHand[i].rank) ?? { key: 0, value: 0 };
        record.value++;
      }

      //TODO: FIND A WAY TO ANNOUNCE TWO FOAKS 
      if (this._handAnnouncements.find(x => x.type === HandAnnouncementType.FOAK) === undefined) {
        var possibleFOAK = rankCount.find(x => x.value === 4 && x.key > Rank.EIGHT);

        if (possibleFOAK !== undefined)
          this.addHandAnnouncement(HandAnnouncementType.FOAK, _playingHand.filter(x => x.rank === possibleFOAK?.key));
      }      
    }

    console.log('current player can announce these HAND announcements: ');
    console.log(this._handAnnouncements);

    this.show();
  }

  private addHandAnnouncement(type: HandAnnouncementType, currentSuit: Card[]): void {
    var handAnnouncement = new HandAnnouncement(type);
    handAnnouncement.details.lowestRank = gameOptions.inGame.cardOrder === 0 ? currentSuit[0].rank : currentSuit[currentSuit.length - 1].rank;
    handAnnouncement.details.highestRank = gameOptions.inGame.cardOrder === 0 ? currentSuit[currentSuit.length - 1].rank : currentSuit[0].rank;
    handAnnouncement.details.sprites = currentSuit.map(x => x.sprite);

    this._handAnnouncements.push(handAnnouncement);
  }

  private show(): void {
    var height = this._rectangle.height / this._handAnnouncements.length;
    for (var i = 0; i < this._handAnnouncements.length; i++) {
      let sprites = this._handAnnouncements[i].details.sprites;
      console.log('sprites for HAND ANNOUNCEMENT');
      console.log(sprites);
      for (var j = 0; j < sprites.length; j++) {
        let sceneSprite = this._scene.children.getByName(sprites[j].name) as GameObjects.Sprite;
        let suit, rank;
        if (sceneSprite.getData('suit') === undefined) {
          let spriteName = sceneSprite.name.split(' ');
          suit = sceneSprite.name.startsWith(constants.belotGameObjectName) ? parseInt(spriteName[2]) : parseInt(spriteName[1]);
          rank = sceneSprite.name.startsWith(constants.belotGameObjectName) ? parseInt(spriteName[4]) : parseInt(spriteName[3]);
        }
        else {
          suit = sceneSprite.getData('suit') as number;
          rank = sceneSprite.getData('rank') as number;
        }
        let frameIndex = (rank - 7) * 4 + suit;
        let offset = 20;
        let singleCardOffset = (this._rectangle.width - offset * 2 - gameOptions.cardWidth * this._scales.X) / sprites.length;
        var sprite = this._scene.add.sprite(this._rectangle.x + offset + singleCardOffset * j, this._rectangle.y + 20, sceneSprite.texture.key, frameIndex)
          .setScale(this._scales.X, this._scales.Y)
          .setDepth(this._rectangle.depth + 1)
          .setName(constants.handAnnouncementObjectName)
          .setOrigin(0, 0);

        if (j + 1 === sprites.length) {
          this._scene.add.text(sprite.x, sprite.y + 20, this._handAnnouncements[i].text)
            .setDepth(this._rectangle.depth + 1);
          }
      }      
    }

    if (this._handAnnouncements.length > 0) {
      this.enabled = true;
      this._rectangle
        .setInteractive({ cursor: 'pointer' });
    }
  }
}
