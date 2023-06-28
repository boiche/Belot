import { GameObjects } from "phaser"
import { constants, gameOptions } from "../../../main";
import { GameAnnouncementType } from "../../BelotEngine/Announcement";
import GameTableScene from "../../scenes/game-table-scene";
import { SignalRPlugin } from "../../scenes/main-scene";
import GameAnnouncementRequest from "../../server-api/requests/signalR/game-announcement-request";
import { BasePopUp } from "./BasePopUp";

class GameAnnouncementsPopUp extends BasePopUp {
  depth: number;
  shown: boolean = false;
  signalR!: SignalRPlugin;
  announcementsData: { enabled: boolean }[] = [];
  hoverColor = 0xD3DCE5;
  disabledColor = 0x878787;
  mainCamera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: GameTableScene, depth: number) {
    super(scene);
    this.depth = depth;
    this.mainCamera = scene.cameras.main;
    this.initControls();
  }

  disableAnnouncements(newAnnouncement: GameAnnouncementType): void {
    for (var index = 0; index < newAnnouncement; index++) {
      this.announcementsData[index]
        .enabled = false;
    }
  }

  override show() {
    var hoverColor = gameOptions.hoverColor;
    var disabledColor = 0x878787;

    var clubs = this.scene.add.sprite(0, 0, constants.clubGameAnnouncement);
    var diamonds = this.scene.add.sprite(0, 0, constants.diamondsGameAnnouncement);
    var hearts = this.scene.add.sprite(0, 0, constants.heartsGameAnnouncement);
    var spades = this.scene.add.sprite(0, 0, constants.spadesGameAnnouncement);
    var noSuit = this.scene.add.sprite(0, 0, constants.noSuitGameAnnouncement);
    var allSuits = this.scene.add.sprite(0, 0, constants.allSuitsGameAnnouncement);
    var background = this.scene.add.sprite(this.mainCamera.width / 2, this.mainCamera.height / 2.5, constants.gameAnnouncementsBackground)
      .setName(constants.belotGameObjectName + constants.gameAnnouncementsBackground)
      .setDepth(this.depth - 1);

    var announcements = [clubs, diamonds, hearts, spades, noSuit, allSuits];

    for (var i = 0; i < announcements.length; i++) {
      announcements[i]
        .setDepth(this.depth)
        .setTint(disabledColor)
        .setName(constants.belotGameObjectName + announcements[i].texture.key);

      var enabled = this.announcementsData[i].enabled;
      if (enabled) {
        announcements[i]
          .setInteractive({ cursor: 'pointer' })
          .clearTint()
          .on('pointerover', function (this: GameObjects.Sprite, event: any) { this.setTint(hoverColor); this.input.cursor = 'hand'; })
          .on('pointerout', function (this: GameObjects.Sprite, event: any) { this.clearTint(); this.input.cursor = 'pointer'; })
          .on('pointerdown', function (this: GameObjects.Sprite, event: any) {
            var scene = (this.scene as GameTableScene);
            var request = new GameAnnouncementRequest();
            switch (this.texture.key) {
              case constants.clubGameAnnouncement: request.announcement = GameAnnouncementType.CLUBS; break;
              case constants.diamondsGameAnnouncement: request.announcement = GameAnnouncementType.DIAMONDS; break;
              case constants.heartsGameAnnouncement: request.announcement = GameAnnouncementType.HEARTS; break;
              case constants.spadesGameAnnouncement: request.announcement = GameAnnouncementType.SPADES; break;
              case constants.noSuitGameAnnouncement: request.announcement = GameAnnouncementType.NOSUIT; break;
              case constants.allSuitsGameAnnouncement: request.announcement = GameAnnouncementType.ALLSUITS; break;
            }

            request.gameId = scene.gameId;            

            scene.signalR.Connection.invoke("Announce", request);

            scene.gameAnnouncements.hide();            
          });
      }
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
    }

    //TODO: disable counter if already declared

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
        var request = new GameAnnouncementRequest();
        request.gameId = scene.gameId;
        request.announcement = GameAnnouncementType.PASS;

        scene.signalR.Connection.invoke("Announce", request);

        scene.gameAnnouncements.hide();
      })
      .setX(first.x + first.width / 2)
      .setY(first.y + first.height * 1.4);


    const extraCamera = this.scene.cameras.add();
    extraCamera.ignore(this.scene.children.getByName('tableCloth') as GameObjects.Image);
    this.scene.cameras.main.ignore(this.scene.dealer.backsGroups[0].getChildren());
    
    this.sprites = announcements.concat(counters).concat([pass, background]);

    this.shown = true;
  }

  initControls() {
    for (var i = 0; i < 8; i++) {
      this.announcementsData.push({ enabled: true });
    }
  }

  reset() {
    this.announcementsData.forEach(x => x.enabled = true);
  }
}

export default GameAnnouncementsPopUp
