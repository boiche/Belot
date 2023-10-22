import { GameObjects, Geom } from "phaser";
import { constants, gameOptions, getBelotGameObjectName } from "../../main";;
import { GameAnnouncementType, HandAnnouncement, HandAnnouncementType } from "../BelotEngine/Announcement";
import GameTableScene from "../scenes/game-table-scene";
import HandAnnouncementRequest from "../server-api/requests/signalR/hand-announcement-request";
import BelotGameObject from "./BelotGameObject";
import { Card, Rank, Suit } from "./Card";

export default class HandAnnounementsRectangle extends BelotGameObject {
  private _handAnnouncements: HandAnnouncement[];
  private _rectangle!: GameObjects.Rectangle;
  private config: HandAnnounementsRectangleConfiguration;

  public enabled: boolean;

  constructor(scene: GameTableScene, config: HandAnnounementsRectangleConfiguration) {
    super(scene, config.name);
    this.enabled = false;
    this._handAnnouncements = [];
    this.config = config;
  }

  public override show(initialPoint: Geom.Point) {
    this._rectangle = this.scene.add.rectangle(this.config.originPoint.x, this.config.originPoint.y, this.config.width, this.config.height, this.config.fillColor);

    this._rectangle
      .setOrigin(0, 0)
      .setDepth(1000)      
      .on('pointerover', () => {
        if (this.enabled) {
          this._rectangle.fillColor = this.config.hoverColor;
        }        
      })
      .on('pointerout', () => {
        this._rectangle.fillColor = this.config.fillColor;
      })
      .on('pointerdown', () => {
        if (this.enabled) {
          var request = new HandAnnouncementRequest();
          request.announcement = this._handAnnouncements[0].type;
          request.gameId = this.scene.gameId;
          request.highestRank = this._handAnnouncements[0].details.highestRank;

          this.scene.signalR.Connection.invoke("HandAnnounce", request);

          this._rectangle.disableInteractive();
          this.scene.children
            .getAll()
            .filter(x => x.name === getBelotGameObjectName(constants.gameObjectNames.handAnnouncement))
            .forEach(x => x.destroy(true));

          this.enabled = false;
        }
      });
  }

  showHandAnnouncements() {
    if (this.scene._belotGame.currentAnnouncement.type === GameAnnouncementType.NOSUIT) {
      return;
    }

    var _playingHand = this.scene.currentPlayer.playingHand;

    for (var suit = 0; suit <= Suit.SPADE; suit++) {
      var currentSuit = this.scene.currentPlayer.playingHand.filter(x => x.suit === suit).sort((x, y) => x.rank - y.rank);
      if (currentSuit.length < 3) {
        continue;
      }

      let sequenceLength = 1;

      for (var index = 1; index < currentSuit.length; index++) {
        if (currentSuit[index].rank === currentSuit[index - 1].rank + 1) {
          sequenceLength++;
        }
        else {
          sequenceLength = 1;
        }
      }

      switch (sequenceLength) {
        case 3: this.addHandAnnouncement(HandAnnouncementType.TERCA, currentSuit); break;
        case 4: this.addHandAnnouncement(HandAnnouncementType.QUARTA, currentSuit); break;
        case 5: this.addHandAnnouncement(HandAnnouncementType.QUINTA, currentSuit); break;
        default: continue;
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

    this.showCards();
  }

  private addHandAnnouncement(type: HandAnnouncementType, currentSuit: Card[]): void {
    var handAnnouncement = new HandAnnouncement(type);
    handAnnouncement.details.lowestRank = gameOptions.inGame.cardOrder === 0 ? currentSuit[0].rank : currentSuit[currentSuit.length - 1].rank;
    handAnnouncement.details.highestRank = gameOptions.inGame.cardOrder === 0 ? currentSuit[currentSuit.length - 1].rank : currentSuit[0].rank;
    handAnnouncement.details.sprites = currentSuit.map(x => x.sprite);

    this._handAnnouncements.push(handAnnouncement);
  }

  private showCards(): void {
    for (var i = 0; i < this._handAnnouncements.length; i++) {
      let sprites = this._handAnnouncements[i].details.sprites;
      console.log('sprites for HAND ANNOUNCEMENT');
      console.log(sprites);
      for (var j = 0; j < sprites.length; j++) {
        let sceneSprite = this.scene.children.getByName(sprites[j].name) as GameObjects.Sprite;
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
        let singleCardOffset = (this._rectangle.width - offset * 2 - gameOptions.cardWidth) / sprites.length;
        var sprite = this.scene.add.sprite(this._rectangle.x + offset + singleCardOffset * j, this._rectangle.y + 20, sceneSprite.texture.key, frameIndex)
          .setDepth(this._rectangle.depth + 1)
          .setName(getBelotGameObjectName("handAnnouncementCard"))
          .setOrigin(0, 0);

        if (j + 1 === sprites.length) {
          this.scene.add.text(sprite.x, sprite.y + 20, this._handAnnouncements[i].text)
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
