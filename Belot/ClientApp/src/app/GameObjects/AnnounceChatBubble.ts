import { constants } from "../../main";
import { HandPositionOptions } from "../BelotEngine/Dealer";
import GameTableScene from "../scenes/game-table-scene";

export default class AnnounceChatBubble {
  private _scene: GameTableScene;
  private _options: HandPositionOptions;
  private _announcementText: string;

  constructor(scene: GameTableScene, announcementText: string) {
    this._scene = scene;
    this._options = new HandPositionOptions(this._scene.cameras.main);
    this._announcementText = announcementText;
  }

  public showBubble(playerRelativeIndex: PlayerNumber) {
    var rectangle;
    var passHeight = 76, passWidth = 76;

    switch (playerRelativeIndex) {
      case 0: {
        rectangle = this._scene.add.rectangle(
          this._options.mainPlayerConfiguration.middlePoint.x - passWidth / 2,
          this._options.mainPlayerConfiguration.middlePoint.y - passHeight,
          passWidth,
          passHeight,
          0xffffff,
          1
        );
      }; break;
      case 1: {
        rectangle = this._scene.add.rectangle(
          this._options.leftPlayerConfiguration.middlePoint.x,
          this._options.leftPlayerConfiguration.middlePoint.y - passHeight / 2,
          passWidth,
          passHeight,
          0xffffff,
          1
        );
      }; break;
      case 2: {
        rectangle = this._scene.add.rectangle(
          this._options.upPLayerConfiguration.middlePoint.x - passWidth / 2,
          this._options.upPLayerConfiguration.middlePoint.y,
          passWidth,
          passHeight,
          0xffffff,
          1
        );
      }; break;
      case 3: {
        rectangle = this._scene.add.rectangle(
          this._options.rightPlayerConfiguration.middlePoint.x - passWidth,
          this._options.rightPlayerConfiguration.middlePoint.y - passHeight / 2,
          passWidth,
          passHeight,
          0xffffff,
          1
        );
      }; break;      
    }
    rectangle
      .setOrigin(0, 0)
      .setName(constants.belotGameObjectName + ' ' + constants.inFieldAnnouncement + ' ' + playerRelativeIndex);

    var text = this._scene.add.text(rectangle.x, rectangle.y, this._announcementText)
      .setOrigin(0, 0)
      .setDepth(rectangle.depth + 1)
      .setFontSize(28)
      .setColor('black')
      .setName(constants.belotGameObjectName + ' ' + constants.inFieldAnnouncement + ' ' + playerRelativeIndex);

    rectangle.width = text.width + 10;

    switch (playerRelativeIndex) {
      case 0:
      case 2: {
        var offsetFromCenter = rectangle.x + rectangle.width / 2 - this._options.sceneMiddlePoint.x;
        console.log('offsetFromCenter ' + offsetFromCenter);
        if (offsetFromCenter > 0)
          rectangle.x -= offsetFromCenter;
        else
          rectangle.x += offsetFromCenter;
      }; break;
      case 3: {
        rectangle.x = (this._options.rightPlayerConfiguration.middlePoint.x - rectangle.width);
      }; break;
    }

    //center the text in the rectangle
    text.y += rectangle.height / 2 - text.height / 2;
    text.x = rectangle.x + (rectangle.width - text.width) / 2;

    setTimeout(this.removeBubble, 2500, [this, playerRelativeIndex]);
  }

  removeBubble(args: any[]) {
    var bubble = args[0] as AnnounceChatBubble;
    var playerRelativeIndex = args[1];

    bubble._scene
      .children
      .getAll()
      .filter(x => x.name === `${constants.belotGameObjectName} ${constants.inFieldAnnouncement} ${playerRelativeIndex}`)
      .forEach(x => x.destroy(true));
  }
}
