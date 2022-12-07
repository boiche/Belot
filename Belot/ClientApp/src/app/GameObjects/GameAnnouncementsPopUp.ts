import { Guid } from "guid-typescript";
import { GameObjects } from "phaser"
import { constants } from "../../main";
import ISignalRProxy from "../proxies/interfaces/ISignalRProxy";
import GameTableScene from "../scenes/game-table-scene";
import { SignalRPlugin } from "../scenes/main-scene";
import BaseRequest from "../server-api/requests/base-request";
import BaseSignalRRequest from "../server-api/requests/signalR/base-signalr-request";

class GameAnnouncementsPopUp {
  sprites: GameObjects.Sprite[];
  scene: GameTableScene;
  depth: number;
  shown: boolean = false;
  signalR!: SignalRPlugin; 

  constructor(scene: GameTableScene, depth: number) {
    this.sprites = [];
    this.scene = scene;
    this.depth = depth;
  }

  show() {
    var hoverColor = 0xD3DCE5;
    var disabledColor = 0x878787;

    var clubs = this.scene.add.sprite(0, 0, constants.clubGameAnnouncement)
    var diamonds = this.scene.add.sprite(0, 0, constants.diamondsGameAnnouncement);
    var hearts = this.scene.add.sprite(0, 0, constants.heartsGameAnnouncement);
    var spades = this.scene.add.sprite(0, 0, constants.spadesGameAnnouncement);
    var noSuit = this.scene.add.sprite(0, 0, constants.noSuitGameAnnouncement);
    var allSuits = this.scene.add.sprite(0, 0, constants.allSuitsGameAnnouncement);
    var background = this.scene.add.sprite(this.scene.windowWidth / 2, this.scene.windowHeight / 2.5, constants.gameAnnouncementsBackground)
      .setName(constants.belotGameObjectName + constants.gameAnnouncementsBackground)
      .setDepth(this.depth - 1);

    var announcements = [clubs, diamonds, hearts, spades, noSuit, allSuits];

    for (var i = 0; i < announcements.length; i++) {
      announcements[i]
        .setDepth(this.depth)
        .setName(constants.belotGameObjectName + announcements[i].texture.key)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerover', function (this: GameObjects.Sprite, event: any) { this.setTint(hoverColor); this.input.cursor = 'hand'; })
        .on('pointerout', function (this: GameObjects.Sprite, event: any) { this.clearTint(); this.input.cursor = 'pointer'; })
        .on('pointerdown', function (this: GameObjects.Sprite, event: any) { (this.scene as GameTableScene).announce(this.texture.key); });
    }

    var first = announcements[0];
    var suitAnnouncements = this.scene.add.group(announcements);
    Phaser.Actions.GridAlign(suitAnnouncements.getChildren(), {
      width: 2,
      height: 4,
      cellWidth: first.width * 1.1,
      cellHeight: first.height * 1.2,
      position: 1,
      x: background.x - background.width / 2 + first.width / 2 + first.width * 0.1,
      y: background.y - background.height / 2 + first.height / 2 + first.height * 2.2
    });


    var double = this.scene.add.sprite(0, 0, constants.doubleGameAnnouncement);
    var redouble = this.scene.add.sprite(0, 0, constants.redoubleGameAnnouncement);
    var counters = [double, redouble];

    for (var i = 0; i < counters.length; i++) {
      counters[i]
        .setDepth(this.depth)
        .setName(constants.belotGameObjectName + counters[i].texture.key)
        .setTint(disabledColor);

      //if (this.scene._belotGame.currentAnnounce) {
      //  counters[i]
      //    .clearTint()
      //    .setInteractive({ cursor: 'pointer' })
      //    .on('pointerover', function (this: GameObjects.Sprite, event: any) { this.setTint(hoverColor); this.input.cursor = 'hand'; })
      //    .on('pointerout', function (this: GameObjects.Sprite, event: any) { this.clearTint(); this.input.cursor = 'pointer'; })
      //    .on('pointerdown', function (this: GameObjects.Sprite, event: any) { console.log('clicked ' + this.texture.key); });
      //}
    }

    first = counters[0];
    var counterAnnouncements = this.scene.add.group(counters);
    Phaser.Actions.GridAlign(counterAnnouncements.getChildren(), {
      width: 2,
      height: 1,
      cellWidth: first.width * 1.1,
      cellHeight: first.height * 1.2,
      position: 1,
      x: announcements[0].x,
      y: announcements[4].y + first.height * 1.5
    });

    var pass = this.scene.add.sprite(0, 0, constants.passGameAnnouncement)
      .setDepth(this.depth)
      .setInteractive({ cursor: 'pointer' })
      .setName(constants.belotGameObjectName + constants.passGameAnnouncement)
      .on('pointerover', function (this: GameObjects.Sprite, event: any) { this.setTint(hoverColor); this.input.cursor = 'hand'; })
      .on('pointerout', function (this: GameObjects.Sprite, event: any) { this.clearTint(); this.input.cursor = 'pointer'; })
      .on('pointerdown', function (this: GameObjects.Sprite, event: any) {
        var scene = (this.scene as GameTableScene);
        scene.signalR.Connection.invoke("Pass", scene.gameId);
      })
      .setX(first.x + first.width / 2)
      .setY(first.y + first.height * 1.4);


    const extraCamera = this.scene.cameras.add();
    extraCamera.ignore(this.scene.children.getByName('tableCloth') as GameObjects.Image);
    this.scene.cameras.main.ignore(this.scene.dealer.backsGroups[0].getChildren());

    this.sprites = announcements.concat(counters).concat([pass, background]);

    this.shown = true;
  }

  hide() {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i]
        .removeAllListeners()
        .removeFromDisplayList()        
        .removeInteractive();

      this.scene.children.getByName(this.sprites[i].name)?.destroy();
    }
    this.shown = false;
  }
}

export default GameAnnouncementsPopUp
