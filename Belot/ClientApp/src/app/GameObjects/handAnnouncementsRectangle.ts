import { Geom } from "phaser";
import { gameOptions } from "../../main";
import { GameAnnouncement, GameAnnouncementType, HandAnnouncement, HandAnnouncementType } from "../BelotEngine/Announcement";
import GameTableScene from "../scenes/game-table-scene";
import { Card, Rank, Suit } from "./Card";

export default class HandAnnounementsRectangle {
  private _scene: GameTableScene;   
  private _handAnnouncements: HandAnnouncement[];
  private _rectangle!: Geom.Rectangle;

  public enabled: boolean;

  constructor(scene: GameTableScene) {
    this._scene = scene;
    this.enabled = false;
    this._handAnnouncements = [];
  }

  draw(initialPoint: Geom.Point) {
    var graphics = this._scene.add.graphics();

    var rectangleX = initialPoint.x + gameOptions.sceneLayout.paddings.leftPadding;
    var rectangleY = window.innerHeight - (gameOptions.sceneLayout.rectangles.height + gameOptions.sceneLayout.paddings.bottomPadding);
    this._rectangle = new Phaser.Geom.Rectangle(rectangleX, rectangleY, gameOptions.sceneLayout.rectangles.width, gameOptions.sceneLayout.rectangles.height);

    graphics.fillStyle(0xFFFFFF);
    graphics.fillRectShape(this._rectangle);

    graphics.lineStyle(5, 0x00000, 1);
    graphics.strokeLineShape(this._rectangle.getLineA());
    graphics.strokeLineShape(this._rectangle.getLineB());
    graphics.strokeLineShape(this._rectangle.getLineC());
    graphics.strokeLineShape(this._rectangle.getLineD());
  }

  showHandAnnouncements() {
    if (this._scene._belotGame.currentAnnouncement.type === GameAnnouncementType.NOSUIT) {
      return;
    }

    this.enabled = true;
    var _playingHand = this._scene.currentPlayer.playingHand;

    //TODO: investigate why after second deal currentPlayer playingHand contains only first 5 cards, instead all 8
    console.log('finding hand announcements within: ');
    console.log(this._scene.currentPlayer.playingHand);

    for (var suit = 0; suit <= Suit.SPADE; suit++) {
      var currentSuit = this._scene.currentPlayer.playingHand.filter(x => x.suit === suit).sort(x => x.rank);
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
            tempJ -= 1;
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
      for (var j = 0; j < sprites.length; j++) {
        this._scene.add.sprite(this._rectangle.x + 20 * (j + 1), this._rectangle.y + 10, sprites[j].texture.key, sprites[j].frame.sourceIndex);
      }
    }
  }
}
